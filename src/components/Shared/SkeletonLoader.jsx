import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'dashboard' }) => {
  
  if (type === 'dashboard') {
    return (
      <div className="skeleton-container" style={{ padding: '2rem' }}>
        {/* Header Skeleton */}
        <div className="skeleton-flex" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div className="skeleton shimmer" style={{ width: '250px', height: '32px', marginBottom: '10px' }}></div>
            <div className="skeleton shimmer" style={{ width: '180px', height: '16px' }}></div>
          </div>
          <div className="skeleton-flex" style={{ gap: '10px' }}>
             <div className="skeleton shimmer" style={{ width: '120px', height: '40px', borderRadius: '8px' }}></div>
             <div className="skeleton shimmer" style={{ width: '120px', height: '40px', borderRadius: '8px' }}></div>
          </div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="skeleton-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton shimmer" style={{ height: '100px', borderRadius: '12px' }}></div>
          ))}
        </div>

        {/* Big Chart Skeleton */}
        <div className="skeleton shimmer" style={{ width: '100%', height: '350px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="skeleton-container" style={{ padding: '2rem' }}>
         <div className="skeleton-flex" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div className="skeleton shimmer" style={{ width: '300px', height: '32px' }}></div>
          <div className="skeleton shimmer" style={{ width: '200px', height: '36px', borderRadius: '20px' }}></div>
        </div>

        {/* Table Header */}
        <div className="skeleton shimmer" style={{ width: '100%', height: '50px', borderRadius: '8px 8px 0 0', marginBottom: '10px' }}></div>
        
        {/* Table Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="skeleton shimmer" style={{ width: '100%', height: '60px', borderRadius: '4px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  // Default block
  return <div className="skeleton shimmer" style={{ width: '100%', height: '200px', borderRadius: '8px' }}></div>;
};

export default SkeletonLoader;
