import React from "react";
import {
  Star,
  CheckCircle,
  Clock,
} from "lucide-react";

import "./VendorWatchlist.css";


const VendorWatchlist = () => {


  const vendors = [

    {
      name: "Elegant Moments Studio",
      category: "Wedding Planner",
      bookings: 124,
      revenue: "£18,500",
      rating: "4.9",
      status: "Verified",
    },


    {
      name: "Royal Feast Catering",
      category: "Catering",
      bookings: 98,
      revenue: "£12,800",
      rating: "4.7",
      status: "Verified",
    },


    {
      name: "Dream Venue Hall",
      category: "Event Venue",
      bookings: 76,
      revenue: "£9,600",
      rating: "4.5",
      status: "Pending",
    },


    {
      name: "LensCraft Studio",
      category: "Photography",
      bookings: 64,
      revenue: "£7,400",
      rating: "4.8",
      status: "Verified",
    },

  ];



  return (

    <div className="vendor-watchlist">


      <div className="vendor-watchlist-header">

        <div>

          <h3>
            Vendor Watchlist
          </h3>

          <p>
            Monitor top performing vendors
          </p>

        </div>


        <button>
          View All
        </button>


      </div>




      <div className="vendor-table-wrapper">


        <table className="vendor-table">


          <thead>

            <tr>

              <th>
                Vendor
              </th>


              <th>
                Category
              </th>


              <th>
                Bookings
              </th>


              <th>
                Revenue
              </th>


              <th>
                Rating
              </th>


              <th>
                Status
              </th>

            </tr>

          </thead>



          <tbody>


            {vendors.map((vendor, index) => (

              <tr key={index}>


                <td className="vendor-name">

                  {vendor.name}

                </td>


                <td>

                  {vendor.category}

                </td>


                <td>

                  {vendor.bookings}

                </td>


                <td>

                  {vendor.revenue}

                </td>


                <td className="vendor-rating">


                  <Star size={15}/>

                  {vendor.rating}


                </td>


                <td>


                  <span
                    className={`vendor-status ${
                      vendor.status === "Verified"
                        ? "verified"
                        : "pending"
                    }`}
                  >


                    {
                      vendor.status === "Verified"
                      ?
                      <CheckCircle size={14}/>
                      :
                      <Clock size={14}/>
                    }


                    {vendor.status}


                  </span>


                </td>


              </tr>

            ))}


          </tbody>


        </table>


      </div>


    </div>

  );

};


export default VendorWatchlist;