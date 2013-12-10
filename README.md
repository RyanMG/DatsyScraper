## Data Scraper for Datsy.io

As part of our first steps in building the front end for [Datsy.io](https://github.com/Datsy/front-end), we needed to source data to populate the site. Datsy's content is entirely data driven, and since we were developing the front end in parallel to the development of the back end team's API that would eventually deliver said data, it was important that we get set up with clean, working mock data as fast as possible to start building with.

While we eventually settled on building JSON objects to hold the mock data, our first pass at collecting data was to set up a series of data scrapers to pull information from sites with no publicly available API. While ultimately unused, this project proved a valuable learning experience, in pulling and parsing data from remote sites, and storing that data cleanly in a PostGreSQL database.
