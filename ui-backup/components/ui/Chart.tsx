'use client';

import React, { useRef, useEffect, useState } from 'react';

type DataPoint = {
  /**
   * Label for the data point
   */
  label: string;
  
  /**
   * Value for the data point
   */
  value: number;
  
  /**
   * Optional color for the data point
   */
  color?: string;
};

type ChartProps = {
  /**
   * Type of chart to display
   */
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  
  /**
   * Data points for the chart
   */
  data: DataPoint[];
  
  /**
   * Width of the chart in pixels
   */
  width?: number;
  
  /**
   * Height of the chart in pixels
   */
  height?: number;
  
  /**
   * Title of the chart
   */
  title?: string;
  
  /**
   * Whether to show the legend
   */
  showLegend?: boolean;
  
  /**
   * Position of the legend
   */
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  
  /**
   * Whether to show grid lines
   */
  showGrid?: boolean;
  
  /**
   * Whether to show axis labels
   */
  showAxisLabels?: boolean;
  
  /**
   * Whether to show data values on the chart
   */
  showValues?: boolean;
  
  /**
   * Whether to animate the chart
   */
  animate?: boolean;
  
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  
  /**
   * Color scheme for the chart
   */
  colorScheme?: 'default' | 'pastel' | 'vibrant' | 'monochrome' | 'gradient';
  
  /**
   * Whether to make the chart responsive
   */
  responsive?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
};

export default function Chart({
  type,
  data,
  width = 600,
  height = 400,
  title,
  showLegend = true,
  legendPosition = 'bottom',
  showGrid = true,
  showAxisLabels = true,
  showValues = false,
  animate = true,
  animationDuration = 1000,
  colorScheme = 'default',
  responsive = true,
  className = '',
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Set up color schemes
  const colorSchemes = {
    default: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D01', '#46BDC6', '#7BAAF7', '#F07B72', '#FCD04F', '#71C287'],
    pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#D3B5E5', '#FFD1DC', '#FFDAC1', '#FFFFD1', '#C1FFD7'],
    vibrant: ['#FF5252', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#F44336', '#FF5722', '#CDDC39', '#009688'],
    monochrome: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#1A1A1A', '#4D4D4D', '#808080', '#B3B3B3', '#E6E6E6'],
    gradient: ['#1A237E', '#283593', '#303F9F', '#3949AB', '#3F51B5', '#5C6BC0', '#7986CB', '#9FA8DA', '#C5CAE9', '#E8EAF6']
  };
  
  // Assign colors to data points if not provided
  const dataWithColors = data.map((point, index) => ({
    ...point,
    color: point.color || colorSchemes[colorScheme][index % colorSchemes[colorScheme].length]
  }));
  
  // Draw bar chart
  const drawBarChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2 - (title ? 30 : 0);
    const barWidth = chartWidth / dataWithColors.length / 1.5;
    const maxValue = Math.max(...dataWithColors.map(d => d.value));
    const scale = chartHeight / maxValue;
    
    // Draw title if provided
    if (title) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, padding / 2);
    }
    
    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    if (showAxisLabels) {
      ctx.moveTo(padding, height - padding);
      ctx.lineTo(padding, padding + (title ? 30 : 0));
    }
    ctx.stroke();
    
    // Draw grid lines
    if (showGrid) {
      ctx.strokeStyle = '#ddd';
      ctx.setLineDash([5, 5]);
      
      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = height - padding - (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // Value labels on y-axis
        if (showAxisLabels) {
          ctx.fillStyle = '#666';
          ctx.font = '12px Arial';
          ctx.textAlign = 'right';
          ctx.fillText((maxValue / 5 * i).toFixed(0), padding - 5, y + 4);
        }
      }
      
      ctx.setLineDash([]);
    }
    
    // Draw bars with animation
    dataWithColors.forEach((point, index) => {
      const barHeight = point.value * scale;
      const x = padding + (chartWidth / dataWithColors.length) * (index + 0.25);
      const y = height - padding - barHeight;
      
      ctx.fillStyle = point.color || '#4285F4';
      
      if (animate) {
        // Animation logic
        const animationProgress = Math.min(1, animationDuration / 1000);
        const currentHeight = barHeight * animationProgress;
        ctx.fillRect(x, height - padding - currentHeight, barWidth, currentHeight);
      } else {
        ctx.fillRect(x, y, barWidth, barHeight);
      }
      
      // Draw value on top of bar
      if (showValues) {
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(point.value.toString(), x + barWidth / 2, y - 5);
      }
      
      // Draw x-axis labels
      if (showAxisLabels) {
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(point.label, x + barWidth / 2, height - padding + 15);
      }
    });
    
    // Draw legend
    if (showLegend) {
      drawLegend(ctx, width, height);
    }
  };
  
  // Draw line chart
  const drawLineChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2 - (title ? 30 : 0);
    const maxValue = Math.max(...dataWithColors.map(d => d.value));
    const scale = chartHeight / maxValue;
    
    // Draw title if provided
    if (title) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, padding / 2);
    }
    
    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    if (showAxisLabels) {
      ctx.moveTo(padding, height - padding);
      ctx.lineTo(padding, padding + (title ? 30 : 0));
    }
    ctx.stroke();
    
    // Draw grid lines
    if (showGrid) {
      ctx.strokeStyle = '#ddd';
      ctx.setLineDash([5, 5]);
      
      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = height - padding - (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // Value labels on y-axis
        if (showAxisLabels) {
          ctx.fillStyle = '#666';
          ctx.font = '12px Arial';
          ctx.textAlign = 'right';
          ctx.fillText((maxValue / 5 * i).toFixed(0), padding - 5, y + 4);
        }
      }
      
      ctx.setLineDash([]);
    }
    
    // Draw line
    ctx.strokeStyle = '#4285F4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    dataWithColors.forEach((point, index) => {
      const x = padding + (chartWidth / (dataWithColors.length - 1)) * index;
      const y = height - padding - point.value * scale;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw x-axis labels
      if (showAxisLabels) {
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(point.label, x, height - padding + 15);
      }
    });
    
    ctx.stroke();
    
    // Draw points and values
    dataWithColors.forEach((point, index) => {
      const x = padding + (chartWidth / (dataWithColors.length - 1)) * index;
      const y = height - padding - point.value * scale;
      
      ctx.fillStyle = point.color || '#4285F4';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw value above point
      if (showValues) {
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(point.value.toString(), x, y - 10);
      }
    });
    
    // Draw legend
    if (showLegend) {
      drawLegend(ctx, width, height);
    }
  };
  
  // Draw pie chart
  const drawPieChart = (ctx: CanvasRenderingContext2D, width: number, height: number, isDoughnut: boolean = false) => {
    const centerX = width / 2;
    const centerY = height / 2 + (title ? 15 : 0);
    const radius = Math.min(width, height) / 2 - 40;
    
    // Draw title if provided
    if (title) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, 20);
    }
    
    const total = dataWithColors.reduce((sum, point) => sum + point.value, 0);
    let startAngle = -Math.PI / 2; // Start from top
    
    // Draw slices
    dataWithColors.forEach((point) => {
      const sliceAngle = (point.value / total) * (Math.PI * 2);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = point.color || '#4285F4';
      ctx.fill();
      
      // Draw slice border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // If doughnut chart, cut out center
      if (isDoughnut) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
      }
      
      // Calculate position for labels
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;
      
      // Draw value in slice
      if (showValues) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const percentage = Math.round((point.value / total) * 100);
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }
      
      startAngle += sliceAngle;
    });
    
    // Draw legend
    if (showLegend) {
      drawLegend(ctx, width, height);
    }
  };
  
  // Draw radar chart
  const drawRadarChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2 + (title ? 15 : 0);
    const radius = Math.min(width, height) / 2 - 40;
    
    // Draw title if provided
    if (title) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, 20);
    }
    
    const maxValue = Math.max(...dataWithColors.map(d => d.value));
    const angleStep = (Math.PI * 2) / dataWithColors.length;
    
    // Draw axes
    if (showGrid) {
      // Draw concentric circles
      for (let i = 1; i <= 5; i++) {
        const levelRadius = radius * (i / 5);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#ddd';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Draw axes lines
      dataWithColors.forEach((_, index) => {
        const angle = -Math.PI / 2 + angleStep * index;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        );
        ctx.strokeStyle = '#ddd';
        ctx.stroke();
      });
    }
    
    // Draw data points and connect them
    ctx.beginPath();
    dataWithColors.forEach((point, index) => {
      const angle = -Math.PI / 2 + angleStep * index;
      const pointRadius = (point.value / maxValue) * radius;
      
      const x = centerX + Math.cos(angle) * pointRadius;
      const y = centerY + Math.sin(angle) * pointRadius;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw axis labels
      if (showAxisLabels) {
        const labelX = centerX + Math.cos(angle) * (radius + 15);
        const labelY = centerY + Math.sin(angle) * (radius + 15);
        
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(point.label, labelX, labelY);
      }
    });
    
    // Close the path and fill with semi-transparent color
    ctx.closePath();
    ctx.fillStyle = 'rgba(66, 133, 244, 0.3)';
    ctx.fill();
    
    // Draw the outline
    ctx.strokeStyle = '#4285F4';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw points
    dataWithColors.forEach((point, index) => {
      const angle = -Math.PI / 2 + angleStep * index;
      const pointRadius = (point.value / maxValue) * radius;
      
      const x = centerX + Math.cos(angle) * pointRadius;
      const y = centerY + Math.sin(angle) * pointRadius;
      
      ctx.fillStyle = point.color || '#4285F4';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw values
      if (showValues) {
        const valueX = centerX + Math.cos(angle) * (pointRadius + 15);
        const valueY = centerY + Math.sin(angle) * (pointRadius + 15);
        
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(point.value.toString(), valueX, valueY);
      }
    });
    
    // Draw legend
    if (showLegend) {
      drawLegend(ctx, width, height);
    }
  };
  
  // Draw polar area chart
  const drawPolarAreaChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2 + (title ? 15 : 0);
    const maxRadius = Math.min(width, height) / 2 - 40;
    
    // Draw title if provided
    if (title) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, 20);
    }
    
    const maxValue = Math.max(...dataWithColors.map(d => d.value));
    const angleStep = (Math.PI * 2) / dataWithColors.length;
    
    // Draw slices
    dataWithColors.forEach((point, index) => {
      const startAngle = -Math.PI / 2 + angleStep * index;
      const endAngle = startAngle + angleStep;
      const radius = (point.value / maxValue) * maxRadius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = point.color || '#4285F4';
      ctx.fill();
      
      // Draw slice border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw labels
      if (showAxisLabels) {
        const midAngle = startAngle + angleStep / 2;
        const labelX = centerX + Math.cos(midAngle) * (maxRadius + 15);
        const labelY = centerY + Math.sin(midAngle) * (maxRadius + 15);
        
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(point.label, labelX, labelY);
      }
      
      // Draw values
      if (showValues) {
        const midAngle = startAngle + angleStep / 2;
        const valueX = centerX + Math.cos(midAngle) * (radius / 2);
        const valueY = centerY + Math.sin(midAngle) * (radius / 2);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(point.value.toString(), valueX, valueY);
      }
    });
    
    // Draw legend
    if (showLegend) {
      drawLegend(ctx, width, height);
    }
  };
  
  // Draw legend
  const drawLegend = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const legendItemHeight = 20;
    const legendItemWidth = 120;
    const legendPadding = 10;
    
    let startX: number;
    let startY: number;
    let itemsPerRow: number;
    
    // Position legend based on legendPosition
    switch (legendPosition) {
      case 'top':
        itemsPerRow = Math.floor(width / legendItemWidth);
        startX = (width - (Math.min(dataWithColors.length, itemsPerRow) * legendItemWidth)) / 2;
        startY = legendPadding + (title ? 30 : 0);
        break;
      case 'right':
        itemsPerRow = 1;
        startX = width - legendItemWidth - legendPadding;
        startY = (height - (dataWithColors.length * legendItemHeight)) / 2;
        break;
      case 'left':
        itemsPerRow = 1;
        startX = legendPadding;
        startY = (height - (dataWithColors.length * legendItemHeight)) / 2;
        break;
      case 'bottom':
      default:
        itemsPerRow = Math.floor(width / legendItemWidth);
        startX = (width - (Math.min(dataWithColors.length, itemsPerRow) * legendItemWidth)) / 2;
        startY = height - legendPadding - Math.ceil(dataWithColors.length / itemsPerRow) * legendItemHeight;
        break;
    }
    
    // Draw legend items
    dataWithColors.forEach((point, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      
      const x = startX + col * legendItemWidth;
      const y = startY + row * legendItemHeight;
      
      // Draw color box
      ctx.fillStyle = point.color || '#4285F4';
      ctx.fillRect(x, y, 15, 15);
      
      // Draw label
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.label, x + 20, y + 7.5);
    });
  };
  
  // Draw chart based on type
  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw chart based on type
    switch (type) {
      case 'bar':
        drawBarChart(ctx, canvas.width, canvas.height);
        break;
      case 'line':
        drawLineChart(ctx, canvas.width, canvas.height);
        break;
      case 'pie':
        drawPieChart(ctx, canvas.width, canvas.height);
        break;
      case 'doughnut':
        drawPieChart(ctx, canvas.width, canvas.height, true);
        break;
      case 'radar':
        drawRadarChart(ctx, canvas.width, canvas.height);
        break;
      case 'polarArea':
        drawPolarAreaChart(ctx, canvas.width, canvas.height);
        break;
      default:
        break;
    }
  };
  
  // Handle window resize for responsive charts
  useEffect(() => {
    setIsClient(true);
    
    if (responsive) {
      const handleResize = () => {
        if (canvasRef.current) {
          const container = canvasRef.current.parentElement;
          if (container) {
            canvasRef.current.width = container.clientWidth;
            canvasRef.current.height = height;
            drawChart();
          }
        }
      };
      
      window.addEventListener('resize', handleResize);
      handleResize();
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } else {
      drawChart();
    }
  }, [type, data, width, height, title, showLegend, legendPosition, showGrid, showAxisLabels, showValues, colorScheme, responsive]);
  
  // Animation effect
  useEffect(() => {
    if (animate && isClient) {
      let startTime: number | null = null;
      let animationFrameId: number;
      
      const animateChart = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        if (elapsed < animationDuration) {
          drawChart();
          animationFrameId = requestAnimationFrame(animateChart);
        } else {
          drawChart();
        }
      };
      
      animationFrameId = requestAnimationFrame(animateChart);
      
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [animate, animationDuration, isClient]);
  
  return (
    <div className={`chart-container ${className}`} style={{ width: responsive ? '100%' : `${width}px` }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="chart-canvas"
      />
    </div>
  );
}