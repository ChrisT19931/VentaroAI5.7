# Email Management System

A comprehensive email logging and management system built with Next.js, Supabase, and TypeScript. This system allows users to upload, store, search, and manage email logs with attachments in a secure cloud environment.

## 🚀 Features

### 1. Email Log Upload
- Upload JSON email logs with structured data (to, from, subject, body, timestamp)
- Automatic timestamp-based file naming: `email-[timestamp].json`
- Validation of required fields
- Support for custom timestamps

### 2. Email Attachments
- Upload email attachments (PDF, DOCX, JPG, PNG, GIF, TXT, ZIP)
- User-organized storage in folders by user ID
- File size limit: 10MB per attachment
- Automatic file type validation

### 3. Email Listing & Retrieval
- List the latest 10 email files with metadata
- Download URLs for direct access
- Retrieve and view individual email log contents
- File size and creation date information

### 4. Search Functionality
- Full-text search across email content
- Search by subject, sender (from), or recipient (to)
- Configurable result limits
- Real-time search results

### 5. User Management
- Secure user-based access control
- Each user can only access their own emails and attachments
- Authentication required for all operations

## 📁 File Structure

```
src/
├── utils/
│   └── email-storage.ts          # Core email storage utilities
├── components/
│   └── EmailManager.tsx          # React component for email management UI
├── app/
│   ├── email-manager/
│   │   └── page.tsx              # Email manager page
│   └── api/emails/
│       ├── upload/
│       │   └── route.ts          # Email upload API
│       ├── list/
│       │   └── route.ts          # List emails API
│       ├── search/
│       │   └── route.ts          # Search emails API
│       ├── attachments/
│       │   └── route.ts          # Attachments API
│       └── [filename]/
│           └── route.ts          # Individual email retrieval/deletion API
scripts/
└── setup-email-storage.js        # Supabase storage setup script
```

## 🛠️ Setup Instructions

### 1. Prerequisites

Ensure you have:
- Supabase project configured
- Environment variables set in `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```

### 2. Storage Setup

Run the setup script to create required storage buckets and policies:

```bash
node scripts/setup-email-storage.js
```

This will create:
- `emails` bucket for JSON email logs (5MB limit)
- `email-attachments` bucket for file attachments (10MB limit)
- Row Level Security policies for user access control

### 3. Manual Setup (Alternative)

If the automated setup fails, run these SQL commands in your Supabase SQL Editor:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('emails', 'emails', false, 5242880, ARRAY['application/json']),
  ('email-attachments', 'email-attachments', false, 10485760, ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/zip'
  ])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can manage emails" ON storage.objects
FOR ALL USING (
  bucket_id = 'emails' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can manage their attachments" ON storage.objects
FOR ALL USING (
  bucket_id = 'email-attachments' AND
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## 📖 Usage Guide

### Web Interface

1. **Access the Email Manager**
   - Navigate to `/email-manager`
   - Login required (redirects to login if not authenticated)

2. **Upload Email Logs**
   - Fill in the email form (to, from, subject, body)
   - Optionally add attachments
   - Set custom timestamp or use current time
   - Click "Upload Email Log"

3. **View Recent Emails**
   - Switch to "Recent Emails" tab
   - Browse the latest 10 email files
   - Click on filenames to view details
   - Download or delete emails

4. **Search Emails**
   - Switch to "Search Emails" tab
   - Enter search terms (subject, sender, recipient)
   - View matching results with previews

### Programmatic Usage

#### 1. Upload Email Log

```typescript
import { uploadEmailLog, EmailLog } from '@/utils/email-storage';

const emailLog: EmailLog = {
  to: 'recipient@example.com',
  from: 'sender@example.com',
  subject: 'Test Email',
  body: 'This is a test email body.',
  timestamp: new Date().toISOString()
};

const filename = await uploadEmailLog(emailLog);
console.log('Uploaded:', filename);
```

#### 2. List Recent Emails

```typescript
import { getLatestEmailFiles } from '@/utils/email-storage';

const emailFiles = await getLatestEmailFiles();
console.log('Recent emails:', emailFiles);
```

#### 3. Retrieve Email Content

```typescript
import { getEmailLog } from '@/utils/email-storage';

const email = await getEmailLog('email-1703123456789.json');
console.log('Email content:', email);
```

#### 4. Upload Attachments

```typescript
import { uploadEmailAttachment } from '@/utils/email-storage';

const file = new File([blob], 'document.pdf', { type: 'application/pdf' });
const url = await uploadEmailAttachment(file, userId, emailTimestamp);
console.log('Attachment URL:', url);
```

#### 5. Search Emails

```typescript
import { searchEmailLogs } from '@/utils/email-storage';

const results = await searchEmailLogs('important meeting', 10);
console.log('Search results:', results);
```

## 🔌 API Endpoints

### POST `/api/emails/upload`
Upload email logs with optional attachments.

**Request:** FormData with email fields and attachment files
**Response:** 
```json
{
  "success": true,
  "filename": "email-1703123456789.json",
  "attachmentCount": 2,
  "message": "Email log uploaded successfully with 2 attachments"
}
```

### GET `/api/emails/list?limit=10`
List recent email files.

**Response:**
```json
{
  "success": true,
  "emails": [
    {
      "filename": "email-1703123456789.json",
      "downloadUrl": "https://...",
      "createdAt": "2023-12-21T10:30:56.789Z",
      "size": 1024
    }
  ],
  "total": 1
}
```

### GET `/api/emails/[filename]`
Retrieve specific email log content.

**Response:**
```json
{
  "success": true,
  "email": {
    "to": "recipient@example.com",
    "from": "sender@example.com",
    "subject": "Test Email",
    "body": "Email content...",
    "timestamp": "2023-12-21T10:30:56.789Z"
  }
}
```

### DELETE `/api/emails/[filename]`
Delete an email log.

**Response:**
```json
{
  "success": true,
  "filename": "email-1703123456789.json",
  "message": "Email log deleted successfully"
}
```

### GET `/api/emails/search?q=term&limit=20`
Search emails by content.

**Response:**
```json
{
  "success": true,
  "results": [...],
  "total": 5,
  "query": "meeting"
}
```

### POST `/api/emails/attachments`
Upload email attachments.

**Request:** FormData with file and optional emailTimestamp
**Response:**
```json
{
  "success": true,
  "url": "https://...",
  "filename": "document.pdf",
  "size": 2048576
}
```

### GET `/api/emails/attachments`
List user's attachments.

**Response:**
```json
{
  "success": true,
  "attachments": [...],
  "total": 3
}
```

## 🔒 Security Features

- **Authentication Required**: All operations require user authentication
- **User Isolation**: Users can only access their own emails and attachments
- **File Type Validation**: Only allowed file types can be uploaded
- **File Size Limits**: 5MB for emails, 10MB for attachments
- **Row Level Security**: Database-level access control
- **Input Validation**: Server-side validation of all inputs

## 📊 Storage Structure

### Emails Bucket (`emails/`)
```
emails/
├── email-1703123456789.json
├── email-1703123567890.json
└── email-1703123678901.json
```

### Attachments Bucket (`email-attachments/`)
```
email-attachments/
├── user-id-1/
│   ├── 1703123456789-document.pdf
│   └── 1703123567890-image.jpg
└── user-id-2/
    ├── 1703123678901-spreadsheet.xlsx
    └── 1703123789012-presentation.pptx
```

## 🎨 UI Components

The `EmailManager` component provides:
- **Tabbed Interface**: Upload, List, Search tabs
- **Form Validation**: Real-time validation and error handling
- **File Management**: Drag-and-drop attachment support
- **Responsive Design**: Mobile-friendly interface
- **Dark Mode Support**: Automatic theme detection
- **Loading States**: Progress indicators for all operations
- **Error Handling**: User-friendly error messages

## 🧪 Testing

### Test Email Upload
```bash
curl -X POST http://localhost:3000/api/emails/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "to=test@example.com" \
  -F "from=sender@example.com" \
  -F "subject=Test Email" \
  -F "body=This is a test email." \
  -F "timestamp=2023-12-21T10:30:56.789Z"
```

### Test Email List
```bash
curl -X GET "http://localhost:3000/api/emails/list?limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Email Search
```bash
curl -X GET "http://localhost:3000/api/emails/search?q=meeting&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Troubleshooting

### Common Issues

1. **Storage Buckets Not Found**
   - Run the setup script: `node scripts/setup-email-storage.js`
   - Check Supabase dashboard for bucket creation

2. **Permission Denied**
   - Verify user authentication
   - Check Row Level Security policies
   - Ensure service role key is correct

3. **File Upload Fails**
   - Check file size limits (5MB emails, 10MB attachments)
   - Verify file type is allowed
   - Check network connectivity

4. **Search Not Working**
   - Ensure emails exist in storage
   - Check search term length (minimum 2 characters)
   - Verify bucket permissions

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=email-storage
```

## 📈 Performance Considerations

- **Pagination**: List operations are limited to prevent large responses
- **Search Optimization**: Search is limited to recent files for performance
- **File Size Limits**: Prevents storage abuse and improves performance
- **Caching**: Download URLs are cached for better performance
- **Lazy Loading**: UI components load data on demand

## 🔮 Future Enhancements

- **Email Templates**: Pre-defined email templates
- **Bulk Operations**: Upload/delete multiple emails
- **Advanced Search**: Date range, attachment filters
- **Email Threading**: Group related emails
- **Export Features**: Export emails to various formats
- **Analytics**: Email usage statistics
- **Webhooks**: Real-time notifications for new emails

## 📝 License

This email management system is part of the Ventaro Digital Store project and follows the same licensing terms.

---

**Need Help?** Check the troubleshooting section or create an issue in the project repository.