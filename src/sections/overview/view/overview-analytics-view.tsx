
import { useState, useRef } from "react";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Button, Container, CssBaseline, FormControl, FormLabel, TextField } from '@mui/material';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import $ from 'jquery';
import axios from "axios";

import { Link } from "react-router-dom";
import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  
  const [email, setEmail] = useState("Pavan");
  const [city, setCity] = useState("Halifax");
  const [duration, setDuration] = useState("5");
  const [tripType, setTripType] = useState("Friends");
  const [tripInterests, setTripInterests] = useState("museums, cafes, nightlife");
  const [budget, setBudget] = useState("500 cad");
  const [age, setAge] = useState('20');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [markerLocation, setMarkerLocation] = useState({
    lat: 51.509865,
    lng: -0.118092,
  });

  const center = {
  lat: 44.646,
  lng: -63.5724,
};

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:"AIzaSyDGItKwmHtL3XJforPpFpzZ-HjX7DULjDc",
});

const [isVisible, setIsVisible] = useState(false);

const [map, setMap] = useState(null);
const [directionsResponse, setDirectionsResponse] = useState(null);
const originRef = useRef();
const destiantionRef = useRef();

const parkData = 
{
  "features": [{
    "properties": {
      "PARK_ID": 960,
      "NAME": "Halifax Citadel National Historic Site",
      "DESCRIPTION": "Flat asphalt surface, 5 components"
    },
    "geometry": {
      "coordinates": [44.6488, -63.5752]
    }
  }, {
    "properties": {
      "PARK_ID": 1219,
      "NAME": "Bob MacQuarrie Skateboard Park (SK8 Extreme Park)",
      "DESCRIPTION": "Flat asphalt surface, 10 components, City run learn to skateboard programs, City run skateboard camps in summer"
    },
    "geometry": {
      "coordinates": [-75.546518086577947, 45.467134581917357]
    }
  }, {
    "properties": {
      "PARK_ID": 1157,
      "NAME": "Walter Baker Skateboard Park",
      "DESCRIPTION": "Concrete bowl, 7,000 sq ft"
    },
    "geometry": {
      "coordinates": [-75.898610599532319, 45.295014379864874]
    }
  }]
}

  const checklistOpenAIResponseDTO = [
    {
      name: "Casual outfits",
      description: "Comfortable clothing for museum visits and dining out.",
      category: "Clothing",
    },
    {
      name: "Light jacket or sweater",
      description: "Warm clothing for chilly evenings.",
      category: "Clothing",
    },
    {
      name: "Comfortable walking shoes",
      description: "Suitable for walking and exploring.",
      category: "Footwear",
    },
    {
      name: "Toiletries (toothbrush, toothpaste, etc.)",
      description: "For hygiene and comfort during the trip.",
      category: "Personal Items",
    },
    {
      name: "Camera or smartphone",
      description: "To capture memories and stay connected.",
      category: "Technology",
    },
    {
      name: "Charger for devices",
      description: "For navigation and communication.",
      category: "Technology",
    },
    {
      name: "Canadian currency (CAD)",
      description: "For budgeting and purchasing tickets.",
      category: "Travel Essentials",
    },
    {
      name: "Dining budget (500 CAD)",
      description: "For enjoying meals at various locations.",
      category: "Dining",
    },
    {
      name: "Personal medications",
      description: "To ensure well-being during travel.",
      category: "Health & Safety",
    },
    {
      name: "ID or passport",
      description: "Essential for identification and travel needs.",
      category: "Documents",
    },
    {
      name: "Sunglasses",
      description: "To protect from sun exposure while exploring.",
      category: "Accessories",
    },
    {
      name: "Hat or cap",
      description: "For comfort during outdoor activities.",
      category: "Accessories",
    },
    {
      name: "Book or e-reader",
      description: "For entertainment during downtime.",
      category: "Miscellaneous",
    },
    {
      name: "Reusable water bottle",
      description: "For staying hydrated during the trip.",
      category: "Miscellaneous",
    },
  ];

  const itineraryData = {
  "itinerary": [
    {
      "day": 1,
      "openAIPlacesResponseList": [
        {
          "sequence": 1,
          "name": "Halifax Citadel National Historic Site",
          "completeAddress": "5391 Sackville St, Halifax, NS B3J 1K8, Canada",
          "longitude": -63.5752,
          "latitude": 44.6488,
          "placeDescription": "Explore the historic Halifax Citadel, offering stunning views of the city and harbor. Engage with costumed interpreters and learn about the military history of Halifax. The site includes interactive exhibits and guided tours, ideal for history enthusiasts.",
          "placeType": "museum",
          "rating": "4.5",
          "totalRatings": "932",
          "costRangePerPersonInCAD": "$10 - $20"
        },
        {
          "sequence": 2,
          "name": "The Local",
          "completeAddress": "1535 Dresden Row, Halifax, NS B3J 3T1, Canada",
          "longitude": -63.5778,
          "latitude": 44.6446,
          "placeDescription": "A cozy cafe known for its locally sourced ingredients and vibrant ambiance. Perfect for a brunch or light lunch with friends. The menu features a variety of sandwiches, salads, and specialty coffees.",
          "placeType": "cafe",
          "rating": "4.7",
          "totalRatings": "478",
          "costRangePerPersonInCAD": "$5 - $15"
        }
      ]
    },
    {
      "day": 2,
      "openAIPlacesResponseList": [
        {
          "sequence": 1,
          "name": "Maritime Museum of the Atlantic",
          "completeAddress": "1721 Lower Water St, Halifax, NS B3J 1S9, Canada",
          "longitude": -63.5701,
          "latitude": 44.6452,
          "placeDescription": "Delve into the maritime history of Nova Scotia at this engaging museum. Highlights include exhibits on shipwrecks, the Titanic, and local maritime culture. Great for interactive experiences and learning about the region's nautical history.",
          "placeType": "museum",
          "rating": "4.6",
          "totalRatings": "642",
          "costRangePerPersonInCAD": "$15 - $25"
        },
        {
          "sequence": 2,
          "name": "The Bicycle Thief",
          "completeAddress": "1662 Barrington St, Halifax, NS B3J 1Z8, Canada",
          "longitude": -63.5788,
          "latitude": 44.6451,
          "placeDescription": "A trendy restaurant famous for its Italian cuisine and vibrant atmosphere. Perfect for dinner with a diverse menu that caters to various tastes, featuring fresh pasta and seafood dishes.",
          "placeType": "cafe",
          "rating": "4.4",
          "totalRatings": "1210",
          "costRangePerPersonInCAD": "$20 - $35"
        }
      ]
    },
    {
      "day": 3,
      "openAIPlacesResponseList": [
        {
          "sequence": 1,
          "name": "Canadian Museum of Immigration at Pier 21",
          "completeAddress": "1741 Hollis St, Halifax, NS B3J 1T7, Canada",
          "longitude": -63.5724,
          "latitude": 44.646,
          "placeDescription": "A unique museum dedicated to the immigration history of Canada, featuring personal stories and artifacts. Visitors can engage with interactive displays and learn about the diverse cultures that shaped Canada.",
          "placeType": "museum",
          "rating": "4.8",
          "totalRatings": "315",
          "costRangePerPersonInCAD": "$7 - $12"
        },
        {
          "sequence": 2,
          "name": "The Carleton",
          "completeAddress": "7-9 Grafton St, Halifax, NS B3J 2G4, Canada",
          "longitude": -63.5707,
          "latitude": 44.6454,
          "placeDescription": "A lively bar and music venue known for its great cocktails and live performances. Perfect spot for a night out with friends, featuring local bands and a welcoming atmosphere.",
          "placeType": "nightlife",
          "rating": "4.5",
          "totalRatings": "830",
          "costRangePerPersonInCAD": "$10 - $20"
        }
      ]
    },
    {
      "day": 4,
      "openAIPlacesResponseList": [
        {
          "sequence": 1,
          "name": "Art Gallery of Nova Scotia",
          "completeAddress": "2021 Gottingen St, Halifax, NS B3K 3B8, Canada",
          "longitude": -63.5821,
          "latitude": 44.6465,
          "placeDescription": "Home to an impressive collection of Nova Scotian and Canadian art, the gallery features rotating exhibits and special events. A great place to appreciate local talent and creativity.",
          "placeType": "museum",
          "rating": "4.7",
          "totalRatings": "564",
          "costRangePerPersonInCAD": "$8 - $15"
        },
        {
          "sequence": 2,
          "name": "Gio",
          "completeAddress": "50-56 Spring Garden Rd, Halifax, NS B3N 1A3, Canada",
          "longitude": -63.5777,
          "latitude": 44.6442,
          "placeDescription": "An upscale dining experience offering contemporary Canadian cuisine. Known for its elegant atmosphere and exquisite dishes, it's perfect for a special night out with friends.",
          "placeType": "cafe",
          "rating": "4.9",
          "totalRatings": "750",
          "costRangePerPersonInCAD": "$15 - $30"
        }
      ]
    },
    {
      "day": 5,
      "openAIPlacesResponseList": [
        {
          "sequence": 1,
          "name": "Halifax Regional Library",
          "completeAddress": "1000 Marginal Rd, Halifax, NS B3H 4P7, Canada",
          "longitude": -63.573,
          "latitude": 44.647,
          "placeDescription": "A modern library offering a wide range of books, digital media, and community events. The architecture is stunning, making it a peaceful place to relax and enjoy some downtime with friends.",
          "placeType": "museum",
          "rating": "4.8",
          "totalRatings": "425",
          "costRangePerPersonInCAD": "$12 - $20"
        },
        {
          "sequence": 2,
          "name": "Bistro Le Coq",
          "completeAddress": "1599 Grafton St, Halifax, NS B3J 2C3, Canada",
          "longitude": -63.5792,
          "latitude": 44.6445,
          "placeDescription": "A charming bistro offering French-inspired dishes and a cozy atmosphere. Ideal for a casual meal or coffee with friends, featuring outdoor seating in warmer months.",
          "placeType": "cafe",
          "rating": "4.6",
          "totalRatings": "289",
          "costRangePerPersonInCAD": "$5 - $15"
        }
      ]
    }
  ],
  "tripDescription": "A 5-day adventure in Halifax with friends, exploring museums, enjoying cozy cafes, and experiencing the nightlife of this vibrant city, all within a budget of 500 CAD."
};
interface Place {
  sequence: number;
  name: string;
  completeAddress: string;
  placeType: string;
  rating: number;
  totalRatings: number;
  costRangePerPersonInCAD: string; // Assuming this is a string
}

interface ItineraryTableProps {
  day: number;
  places: Place[];
}
  const ItineraryTable = ({ day, places }) => (
  <div>
    <h3>Day {day}</h3>
    <table border="1">
      <thead>
        <tr>
          <th>Sequence</th>
          <th>Name</th>
          <th>Address</th>
          <th>Type</th>
          <th>Rating</th>
          <th>Total Ratings</th>
          <th>Cost Range (CAD)</th>
        </tr>
      </thead>
      <tbody>
        {places.map(place => (
          <tr key={place.sequence}>
            <td>{place.sequence}</td>
            <td>{place.name}</td>
            <td>{place.completeAddress}</td>
            <td>{place.placeType}</td>
            <td>{place.rating}</td>
            <td>{place.totalRatings}</td>
            <td>{place.costRangePerPersonInCAD}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

  const handleLogin = () => {
    const p_email = email;
    const p_city = city;
    const p_duration = duration;
    const p_tripType = tripType;
    const p_tripInterests = tripInterests;
    const p_budget = budget;
    const p_age = age;

    toggleVisibility()    
    toggleDiv()
  };

  const toggleDiv = () => {
    setIsVisible((prev) => !prev);
  };

 const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back to PMS (Plan-Move-Stay) 👋
      </Typography>

      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="ip_name"
          label="Your Name"
          name="ip_name"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
            <MenuItem value={40}>Forty</MenuItem>
            <MenuItem value={50}>Fifty</MenuItem>
          </Select>

          <TextField
            margin="normal"
            required
            fullWidth
            id="city"
            name="city"
            label="city"
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
          /> */}

          <TextField
            margin="normal"
            required
            fullWidth
            id="duration"
            name="duration"
            label="duration"
            type="text"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="tripType"
            name="tripType"
            label="tripType"
            type="text"
            value={tripType}
            onChange={(e) => {
              setTripType(e.target.value);
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="tripInterests"
            name="tripInterests"
            label="tripInterests"
            type="text"
            value={tripInterests}
            onChange={(e) => {
              setTripInterests(e.target.value);
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="budget"
            name="budget"
            label="budget"
            type="text"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
            }}
          />
      </Box>

      <Grid container spacing={3}>
        <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ mt: 1 }}>
            
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={toggleDiv}
            >
              Generate the Plan For Me
            </Button>
            
          </Box>
        </Box>
      </Container>
      </Grid>

      <div>
        {isVisible && (
        <>
          <div>
            <h1>Halifax 5-Day Itinerary</h1>
            <p>{itineraryData.tripDescription}</p>
            {itineraryData.itinerary.map(item => (
              <ItineraryTable key={item.day} day={item.day} places={item.openAIPlacesResponseList} />
            ))}
          </div>

          <GoogleMap
              center={center}
              zoom={12}
              mapContainerStyle={{ width: "100%", height: "100vh" }}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
          >
              {parkData.features.map(park => (
                <Marker
                  key={park.properties.PARK_ID}
                  position={{
                    lat: park.geometry.coordinates[1],
                    lng: park.geometry.coordinates[0]
                  }}
                  icon={{
                    url: `/skateboarding.svg`,
                    scaledSize: new window.google.maps.Size(25, 25)
                  }}
                />
              ))}
          </GoogleMap>

          <Grid container spacing={2}>
            <h1>Checklist</h1>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "10px" }}>Name</th>
                  <th style={{ border: "1px solid #ccc", padding: "10px" }}>Description</th>
                  <th style={{ border: "1px solid #ccc", padding: "10px" }}>Category</th>
                </tr>
              </thead>
              <tbody>
                {checklistOpenAIResponseDTO.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>{item.name}</td>
                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>{item.description}</td>
                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
        </>
        )}
      </div>

      <Grid container spacing={3}>
        {/* <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Weekly sales"
            percent={2.6}
            total={714000}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="New users"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Purchase orders"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Messages"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
