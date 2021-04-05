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
    const httpResponse = await axios({
        method: "post",
        url,
        data: body,
        headers: { "Content-Type": "application/json" }
    });
    res.send(formatOffers(httpResponse.data));
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

function formatOffers(rawOffers) {
    return {
        count: rawOffers.count,
        results: buildResults()
    };

    function buildResults() {
        return rawOffers.result
            .filter(offer => offer.missionType === "VIE")
            .map(offer => ({
                id: offer.id,
                company: offer.organizationName,
                title: offer.missionTitle,
                category: offer.activitySectorN1,
                keywords: (offer.specializations || []).map(spe => spe.specializationLabelEn),
                duration: offer.missionDuration,
                viewCounter: offer.viewCounter,
                candidateCounter: offer.candidateCounter,
                location: {
                    country: offer.countryNameEn,
                    city: offer.cityNameEn
                },
                creationDate: offer.creationDate,
                missionDates: {
                    startDate: offer.missionStartDate,
                    endDate: offer.missionEndDate 
                },
                link: `https://mon-vie-via.businessfrance.fr/offres/${offer.id}`
            }))
            .sort((offerA, offerB) => (new Date(offerB.creationDate)).getTime() - (new Date(offerA.creationDate)).getTime());
    }
}