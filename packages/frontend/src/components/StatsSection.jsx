import { useState, useEffect, useRef } from "react";
import "./StatsSection.css"; 


function AnimatedNumber({ end, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        
        if (entries[0].isIntersecting) {
          let startTimestamp = null;
          const duration = 2500; 

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            
            const easeOut = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOut * end));

            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };

          window.requestAnimationFrame(step);
          observer.disconnect(); 
        }
      },
      { threshold: 0.5 } 
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}


function StatsSection() {
  
  const stats = [
    {
      num: 9572,
      suffix: "+",
      title: "Happy Customers",
    },
    {
      num: 874,
      suffix: "+",
      title: "Trusted Vendors",
    },
    {
      num: 33,
      suffix: "+",
      title: "Event Categories",
    },
    {
      num: 94,
      suffix: "+",
      title: "Locations",
    },
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-item">
            
            <h3 className="stat-number">
              
              <AnimatedNumber end={stat.num} suffix={stat.suffix} />
            </h3>
            
            <p className="stat-title">
              {stat.title}
            </p>
            
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;