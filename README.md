# Hypertube the Netflix clone

## by [ghorvath](https://github.com/mobahug), [erikpeik](https://github.com/erikpeik), [acamaras0](https://github.com/acamaras0) and [SeanTroy](https://github.com/SeanTroy)

Hypertube is a movie-watching website where you can choose from over 43.000 films.
We added 4 different languages to translate the website and based on that subtitles, qualities and what a basic movie-watching website needs.
Created in only 4weeks.

## Tools & Languages

  - PostgreSQL
  - React
  - Redux
  - Express
  - MUI
  - Nodejs,
  - Docker
  - pgAdmin
  - DataGrip
  - Atlassian, Jira
  - CSS
  - HTML


# Features:

## Logging in/Registration and Profile Page

  - We have a basic login with UI response in case of error.
  - Two-step registration with email verification.
  - Forget password with email link token.
  - Using Google API to translate emails and error/success messages
  - Basic info on the Profile page
  - Upload profile picture
  - Change password, email, firstname, lastname, username, language
  - Switch button to change infinite scroll and pagination on the movie browsing page
  
  
  <div>
    <img height="320em"  src="https://user-images.githubusercontent.com/83179142/202658873-2df0c9f2-3e1c-43da-9aa3-1d2088ce2a1a.gif" alt="gif"/>
  </div>
  
  
  ## Browsing
  
  - Listing movies by default most recent ones
  - Complex search and filter feature
  - Direct search for movie titles


  <div>
    <img height="320em"  src="https://user-images.githubusercontent.com/83179142/202667460-26960950-79a1-47cc-a932-69ba974d253f.gif" alt="gif"/>
  </div>


  ## Movie page
  
  - Video player
  - Comment section
  - Visit other user's profile page
  - Movie description and additional details
  - Based on the movie, a recommendation list of movies
  - After clicking the play button, add the movie to the user's watchlist and marked as watched on the browsing page

  <div>
    <img height="320em"  src="https://user-images.githubusercontent.com/83179142/202673859-8fda9939-d2fc-4f68-a8b9-3a1687e7139d.gif" alt="gif"/>
  </div>


## Video player

  - Streaming the video using yts torrent API
  - Changeable subtitles, by default based on the choosen language or availability
  - Changeable quality
  - Basic features like: pause/play
  - Fullscreen
 
 
  <div>
    <img height="320em"  src="https://user-images.githubusercontent.com/83179142/202702017-ddacdcd1-1e05-4d8d-8d8d-92750eed1d21.gif" alt="gif"/>
  </div>
 
## Additional feature:

  - Using crontab when a movie wasn't watched over 30 days from any user, get deleted from project file
    On users watchlsit will stay anyway the movie
