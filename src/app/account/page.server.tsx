import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function getServerSideData() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.error('No valid session found, redirecting to login');
      redirect('/signin');
    }

    const user = session.user;
    const userId = user.id;
    const adminClient = getSupabaseAdmin();
  
  try {
    // Fetch user orders with product details
    const { data: ordersData, error: ordersError } = await adminClient
      .from('orders')
      .select(`
        id,
        created_at,
        total,
        status,
        order_items(id, product_id, quantity, price, download_url, download_count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return {
        orders: [],
        isAdmin: false,
      };
    }

    // Fetch product details for each order item
    const ordersWithProducts = await Promise.all(
      ordersData.map(async (order) => {
        const orderItems = order.order_items;
        
        if (orderItems && orderItems.length > 0) {
          const itemsWithProductDetails = await Promise.all(
            orderItems.map(async (item) => {
              try {
                const { data: productData, error: productError } = await adminClient
                  .from('products')
                  .select('name, image_url, type')
                  .eq('id', item.product_id)
                  .single();
                
                if (productError) {
                  console.error(`Error fetching product ${item.product_id}:`, productError);
                  return {
                    ...item,
                    product: { name: 'Product unavailable', image_url: null, type: null }
                  };
                }
                
                return {
                  ...item,
                  product: productData
                };
              } catch (err) {
                console.error(`Error processing item ${item.id}:`, err);
                return {
                  ...item,
                  product: { name: 'Product unavailable', image_url: null, type: null }
                };
              }
            })
          );
          
          return {
            ...order,
            order_items: itemsWithProductDetails
          };
        }
        
        return order;
      })
    );

    // Check if user is admin
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .single();

    const isAdmin = profile?.user_role === 'admin';

    return {
      orders: ordersWithProducts,
      isAdmin,
      user,
    };
  } catch (error) {
    console.error('Error in getServerSideData:', error);
    return {
      orders: [],
      isAdmin: false,
      user: null,
    };
  }
  } catch (error) {
    console.error('Error in session handling:', error);
    return {
      orders: [],
      isAdmin: false,
      user: null,
    };
  }
}