import React, { useEffect, useState } from 'react';
import { fetchListings } from './API';

//To Grab Listings from API
function useListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchListings().then((response) => {
      setListings(response.listings)
    });
  }, []);

  return listings;
}

//To Set Current Page
function onClick(setCurrentPage) {
  return function(event) {
    let currentPage = Number(event.target.id)
    setCurrentPage(currentPage);
  }
}

//To Set Current Filter
function onChange(setFilter) {
  return function(event) {
    let currentFilter = event.target.value
    setFilter(currentFilter);
  }
}

//To Have Unique Filters/No Repeats
function isUnique(listings) {
  let seen = {}

  return listings.filter((listing) => {
    return seen.hasOwnProperty(listing.make) ? false : (seen[listing.make] = true);
  })
}

//To Display Current Listings Per Page
function currentListingsPerPage(listings, listingsPerPage, currentPage, currentFilter) {
  let currentListings;

  if (currentFilter === "All") {
    currentListings = listings
  } else {
    currentListings = listings.filter((listing) => {
      return listing.make === currentFilter
    })
  }

  let indexOfLastListing = currentPage * listingsPerPage; //1 * 10 === 10
  let indexOfFirstListing = indexOfLastListing - listingsPerPage; //10 - 10 === 0
  return currentListings.slice(indexOfFirstListing, indexOfLastListing) //listings.slice(0, 10)
}

export default function ListingsPage() {
  //Current Page state - default is 1
  const [currentPage, setCurrentPage] = useState(1);
  //Filter state - default is "All"
  const [filter, setFilter] = useState('All');
  //Grabs all listinngs from API
  const listings = useListings();
  //How many listings to display per page
  const listingsPerPage = 10;
  console.log('listings', listings)

  //Creates Page Numbers array to display on bottom of page
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(listings.length / listingsPerPage); i++) {
      pageNumbers.push(i);
    }

  return (
    <div className="viewallcontainer">
        <div className="viewallsidebar">
          <h1>Reverb</h1>
          <div id="product-filter">
            <label htmlFor="productFilter">Choose Brand:</label>
            <select name="productFilter" onChange={onChange(setFilter)}>
              <option>All</option>
              { isUnique(listings).map(listing => (
                <option key={listing.id}>{listing.make}</option>
              )) }
            </select>
          </div>
        </div>
      <ul className="listings__list">
        {currentListingsPerPage(listings, listingsPerPage, currentPage, filter).map((listing) => (
          <li key={listing.id} className="listings__list-item">
            <img
              alt={listing.title}
              src={listing.photos[0]._links.small_crop.href}
            />
            <div className="listings__list-title">
              {listing.title}
            </div>
          </li>
        ))}
      </ul>
      <div className="page_list_container">
        <ul className="page_list">
          {pageNumbers.map((page) => (
          <li key={page} id={page} className="page_num"><button id={page} onClick={onClick(setCurrentPage)}>{page}</button></li>
          ))}
        </ul>
      </div>
    </div>
  );

}


