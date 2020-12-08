'use strict'

function getJobs(username) {
  fetch(`https://remotive.io/api/remote-jobs?search=${username}`)//${}is a template string
    .then(response => response.json())
    .then(responseJson => displayJobs(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayJobs(responseJson){
  console.log(responseJson)
//reads the data from the fetch and creates an html
  $("#results").html("")//clears the results div
  responseJson.jobs.forEach(item=>{//loops thru the arr
    $(".main").removeClass("hidden");
    $("#results").append(`
    <div class="item">
    <h2>${item.title}</h2>
    <h3>
    <a href="${item.url}" target="_blank">${item.company_name}</a>
    </h3>
    <h4>${item.candidate_required_location}</h4>

    <button onClick="getVideos('${item.company_name}')">
    Get Videos 
    </button>
    
    </div>
    `)//appends image to results div
  })
}

function watchForm() {
  $('#form').submit(event => {
    event.preventDefault();
    const username= event.target.username.value
    console.log(username);
    getJobs(username);
  });
}

$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});

// put your own value below!
const apiKey = 'AIzaSyBgejphbsWHpuG6fTcc8L0vd3df1Hm6rpQ'; 
const searchURL = 'https://www.googleapis.com/youtube/v3/search';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayVideos(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#videos').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#videos').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
    
      <iframe 
        width="320" 
        height="315"
        src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}">
      </iframe>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
  const topSet=document.getElementById("videos").offsetTop;
  //offSetTop means to take the position of the div or element
  window.scrollTo(0,topSet);
};

function getVideos(query, maxResults=10) {
  const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    maxResults,
    type: 'video'
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayVideos(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}