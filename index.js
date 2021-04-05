const express = require('express')
const cors = require('cors');
const axios = require('axios');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())

app.get('/', (_, res) => {
    res.send("Please query /offers");
});

app.get('/offers', async (_, res) => {
    const url = "https://civiweb-api-offre-prd.azurewebsites.net/api/Offers/search";
    const body = buildBody();
    const data = await axios({
        method: "post",
        url,
        data: body,
        headers: { "Content-Type": "application/json" }
    });
    res.send(data.data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});


function buildBody() {
    return JSON.stringify({
        "latest":"true",
        "activitySectorId":0,
        "missionsTypesIds":[0],
        "missionsDurations":[0],
        "gerographicZones":[0],
        "countriesIds":[0],
        "studiesLevelId":0,
        "companiesSizes":[0],
        "specializationsIds":[0],
        "entreprisesIds":[0],
        "missionStartDate":null,
        "query":null,
        "skip":0,
        "limit":0
    });
}