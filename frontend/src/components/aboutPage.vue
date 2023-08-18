<script setup>
import notification from './notification.vue';
</script>
<script>
export default {
    methods: {
        resizeFlowChart() {
            document.getElementById("flowchart").classList.toggle("small-chart");
        },
        resizePhoto() {
            document.getElementById("groupPhoto").classList.toggle("small-photo");
        }
    }
};
</script>

<template>
    <notification />
    <p id="heading">2023 IT Asset Project</p>
    <div> </div>
    <table id="descriptions">
        <tr>
            <th id="tableHeading" colspan="4">Core functionality: Gathers server and database information from various
                hosts, compiles them, and displays them on a webpage.</th>
        </tr>
        <tr id="headerLabels">
            <th class="tableLabel">Backend</th>
            <th class="tableLabel">Authentication</th>
            <th class="tableLabel">Frontend</th>
            <th class="talbeLabel">Distribution</th>
        </tr>
        <tr>
            <td class="description">Gathers data from a series of automated Powershell scripts that collect the data and
                send it to a set host in json format. The host runs a series of programs that compile each set of data into
                separate lists, checking for outdated information and deleting it. The backend then utilizes the get and
                post APIs in order to store and transmit the data to the frontend.</td>
            <td class="description">Upon frontend fetch request, the login API checks the provided username and password. If
                they are valid, the API will return a token that is stored in a cookie and passed to authentication API. If
                the token is valid, the auth API allows the page to load.</td>
            <td class="description">Utilizes Vue3 and fetch APIs to retrieve the data from the set host. The data is then
                displayed in a series of tables which can be filtered through the collapsible sidebar and searched as
                desired.</td>
            <td class="description">The code is all compiled in Docker containers that are hosted and stored on a virtual
                server in Azure to ensure the programs can run constantly and be accessed as needed.</td>
        </tr>
        <tr>
            <td class="people">Jared, Fahd, Ethan</td>
            <td class="people">Stephen</td>
            <td class="people">Evan, Ian, Stephen, Ethan</td>
            <td class="people">Jared</td>
        </tr>
    </table>

    <!--<div id = "backendDescription">Backend: Gathers data from a series of automated Powershell scripts that collect the data and send it to a set host in a json file. The host runs a series of programs that compile each set of data into separate lists, checking for outdated information and deleting it. The backend then utilizes the get and post APIs in order to store and transmit the data to the frontend. </div>

        <div id = authDescription>Authentication: Something with tokens and stuff. Requires a valid username and password  to ensure information is only accessed by the intended users. </div>

        <div id = frontendDescription>Frontend: Utilizes the fetch API to retrieve the data from the set host. The data is then displayed in a series of tables. The tables can be filtered with search functionality. </div>

        <div>Distribution: The code is all compiled and stored in a container that is hosted on a virtual server so the programs can run constantly and be accessed as needed.</div>-->

    <!--<figure>
        <img id = "flowchart" src="https://i.ibb.co/wrFLqF8/Microsoft-Teams-image.png">
        <figcaption>Flowchart showing capabilities and path of data</figcaption>
        <figcaption>Click <button id = "resizeButton" type="button" @click="resizeFlowChart()">HERE</button> to enlarge</figcaption>
    </figure>
    

    <p></p>
        
    
    <img id = "groupPhoto" src="https://i.ibb.co/3CjkpCY/Intern-Group-Photo-Good.jpg">
    <p>Designed by La Salle College High School class of 2024 summer interns</p>
    <p>Members: Ethan Pakuris, Jared Werts, Ian Whitaker, Evan Comiciotto, Fahd Khan, and <a id = "partyModeLink" href="partymode=true">Stephen Trezza</a></p>
    <p>(From left to right as pictured)</p>-->

    <div class="row">
        <div class="collumn">
            <img id="flowchart" src="/src/assets/IT-Asset-Flowchart.png" @click="resizeFlowChart()">
            <figcaption>Flowchart showing capabilities and path of data</figcaption>
        </div>
        <div class="collumn">
            <img id="groupPhoto" src="/src/assets/Intern-Group-Photo-Good.png" @click="resizePhoto()">
            <p>Designed by La Salle College High School class of 2024 summer interns</p>
            <p class="internList">Members: Ethan Pakuris, Jared Werts, Ian Whitaker, Evan Comiciotto, Fahd Khan, and <a
                    id="stName" href="partymode=true">Stephen Trezza</a></p>
            <p class="finePrint">(From left to right as pictured)</p>
        </div>
    </div>
</template>


<style scoped>
table {
    width: 80%;
    height: auto;
}

table,
td,
th {
    padding: 2px;
    width: 26%;
    vertical-align: top;
    border: 1px solid;
    border-collapse: collapse;
}

#heading {
    font-weight: bold;
    font-size: xx-large;

    padding-top: 10px;
    padding-bottom: 50px;
}

#headerLabels {
    background-color: #708490;
    color: #27272d;
}

#descriptions {
    text-align: center;
    padding-left: 10%;
    padding-right: 10%;
    padding-top: 10px;
    width: 80%;
    margin: auto;
    table-layout: fixed;
}

th {
    font-size: large;
}

#tableHeading {
    background-color: white;
    color: #27272d;
    background-color: #ef3b32;
    font-size: larger;
}

.people {
    border-top: none;
    padding-top: 10px;
}

.description {
    border-bottom: none;
}

#stName {
    color: black;
    text-decoration: none;

}

p {
    color: black;
}

.collumn {
    float: left;
    width: 50%;
    padding: 5px;
}

.row::after {
    content: "";
    clear: both;
    display: table;
}


#flowchart {
    width: 80%;
    height: auto;
    margin-right: auto;
    margin-left: auto;
}

figcaption {
    font-size: small;
    margin-right: auto;
}

.small-chart {
    width: 40% !important;
    margin-left: auto;
    margin-right: 0px;
}

.small-photo {
    width: 40% !important;
    margin-left: 0px;
    margin-right: auto;
}

#groupPhoto {
    width: 60%;
    height: auto;
    padding-top: 10px;
}

.internList {
    font-size: small;
}

.finePrint {
    font-size: x-small;
}</style>
