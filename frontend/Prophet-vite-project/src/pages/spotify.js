// src/spotify.js
export const getSpotifyToken = async () => {
    const clientId = "cdb9bc49d82e4c23b3f1c4abff3ef336";
    const clientSecret = "aa1d32fa00474da39f7c352d05a5b8c2";
  
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(clientId + ":" + clientSecret)}`,
      },
      body: "grant_type=client_credentials",
    });
  
    const data = await response.json();
    return data.access_token;
  };
  
  export const fetchSpotifyArtistImage = async (artistName) => {
    const token = await getSpotifyToken();
  
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        artistName
      )}&type=artist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
    if (data.artists.items.length > 0) {
      return data.artists.items[0].images[0].url;
    } else {
      return "https://via.placeholder.com/150";
    }
  };
  