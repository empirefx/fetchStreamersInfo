import axios from 'axios';
import * as cheerio from 'cheerio';

const axiosInstance = axios.create({
    baseURL: 'https://www.twitch.tv',
    timeout: 1000,
    maxRedirects: 0,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    }
});

export default async (event, context) => {
    const streamers = ['']; // Set streamers to fetch

    async function fetchStreamerData(streamer) {
        const url = `/${streamer}`;

        try {
            const { data } = await axiosInstance.get(url);
            const $ = cheerio.load(data);
            const script = $('script[type="application/ld+json"]').html(); // Streamer status and preview images

            // CSS attribute selectors & default props

            const title = $('meta[property="og:description"]').attr('content') || 'N/A';
            const avatar = $('meta[property="og:image"]').attr('content') || 'N/A';
            let isOnline = false;
            let thumbnailUrls = 'N/A';

            // Check if the specific script tag is found
            if (script) {
                try {
                    const jsonData = JSON.parse(script);

                    // Access properties
                    isOnline = jsonData["@graph"][0]["publication"]["@type"] === "BroadcastEvent";
                    thumbnailUrls = jsonData["@graph"][0]["thumbnailUrl"];

                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            } else {
                // console.error('No JSON-LD script tag found');
            }

            return {
                streamer,
                title,
                avatar,
                thumbnailUrls,
                isOnline
            };

        } catch (error) {
            console.error(`Error fetching data for ${streamer}:`, error.message);
            return null;
        }
    }

    const results = await Promise.all(streamers.map(fetchStreamerData));

    return {
        statusCode: 200,
        body: results,
    };
};
