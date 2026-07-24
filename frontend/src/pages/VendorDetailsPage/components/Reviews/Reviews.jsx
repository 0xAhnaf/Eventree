import React from "react";
import "./Reviews.css";

const Reviews = () => {

  const reviews = [
    {
      name: "Sarah Ahmed",
      rating: "★★★★★",
      comment:
        "Amazing service and very professional team. They made our event memorable."
    },

    {
      name: "Rahim Hasan",
      rating: "★★★★★",
      comment:
        "Great experience. Quality work and excellent communication."
    },

    {
      name: "Nusrat Jahan",
      rating: "★★★★☆",
      comment:
        "Good service with creative ideas. Highly recommended."
    }
  ];


  return (
    <section 
      className="reviews-section"
      id="reviews"
    >


      <h2>
        Reviews
      </h2>



      <div className="rating-summary">


        <h3>
          4.9
        </h3>


        <div>

          <div className="stars">
            ★★★★★
          </div>


          <p>
            Based on 120 Reviews
          </p>

        </div>


      </div>



      <div className="reviews-list">


        {
          reviews.map((review, index) => (

            <div 
              className="review-card"
              key={index}
            >


              <div className="review-header">


                <h4>
                  {review.name}
                </h4>


                <span>
                  {review.rating}
                </span>


              </div>



              <p>
                {review.comment}
              </p>



            </div>

          ))
        }


      </div>


    </section>
  );
};


export default Reviews;