<template>
    <notification />
    <div style="background: #f1f1f1; color: white;">
        <div class="frame">
            <div class="innerFrame">
                <img id="groupPhoto" class="picture2023" src="/src/assets/Intern-Group-Photo-Good.png"
                    @click="resizePhoto()" />
                <div class="textA2023">
                    <p id="heading" style="color: white;">2023 IT Asset Project</p>
                    <p style="font-size: 2rem;">{{ version }}</p>
                    Designed by La Salle College High School Class of 2024 Summer Interns:
                    <div class="textB2023">
                        Ethan Pakuris, Jared Werts, Ian Whitaker, Evan
                        Comiciotto, Fahd Khan, and
                        <a style="color: white;" id="stName" href="partymode=true">Stephen Trezza</a> <br>
                        (From left to right as pictured)
                    </div>
                </div>
            </div>
        </div>
        <div style="margin: 6rem;"></div>
        <div class="p">
            <div class="innerP">Backend</div>
        </div>
        <div class="textp" style="margin: 3rem; margin-bottom: 6rem;">
            <div class="shapes" id="shapeOne">
                Gathers data from a series of automated Powershell scripts that
                collect the data and send it to a set host in json format. <br>
                The host runs a series of programs that compile each set of data
                into separate lists, checking for outdated information <br>
                and deleting it. The backend then utilizes the get and post APIs in
                order to store and transmit the data to the frontend.
                <div class="name">- Jared, Fahd, and Ethan</div>
                <div class="symbols"><i class="bi bi-body-text"></i></div>
            </div>
        </div>
        <div class="p">
            <div class="innerP">Authentication</div>
        </div>
        <div class="textp" style="margin: 3rem; margin-bottom: 6rem;">
            <div class="shapes" id="shapeTwo">
                Upon frontend fetch request, the login API checks the provided
                username and password. If they are valid, the API will return a <br>
                token that is stored in a cookie and passed to authentication
                API. If the token is valid, the auth API allows the page to
                load.
                <div class="name" style="left: 400px;">- Stephen</div>
                <div class="symbols"><i class="bi bi-lock"></i></div>
            </div>
        </div>
        <div class="p">
            <div class="innerP">Frontend</div>
        </div>
        <div class="textp" style="margin: 3rem; margin-bottom: 6rem;">
            <div class="shapes" id="shapeThree">
                Utilizes Vue3 and fetch APIs to retrieve the data from the set
                host. The data is then displayed in a series of tables which <br>
                can be filtered through the collapsible sidebar and searched as
                desired.
                <div class="name" style="left: 330px;">- Evan, Ian, Stephen, and Ethan</div>
                <div class="symbols"><i class="bi bi-code-slash"></i></div>
            </div>
        </div>
        <div class="p">
            <div class="innerP">Distribution</div>
        </div>
        <div class="textp" style="margin: 3rem; margin-bottom: 6rem;">
            <div class="shapes" id="shapeFour">
                The code is all compiled in Docker containers that are hosted
                and stored on a virtual server in Azure to ensure the programs <br>
                can run constantly and be accessed as needed.
                <div class="name" style="left: 405px;">- Jared</div>
                <div class="symbols"><i class="bi bi-pc-display"></i></div>
            </div>
        </div>

        <div class="frame">
            <div class="innerFrame">
                <img id="groupPhoto" class="picture2024" src="/src/components/router/cheese.gif" />
                <div class="textA2024">
                    <p id="heading" style="color: white;">2024 IT Asset Project (Coming Soon)</p>
                    Designed by La Salle College High School Class of 2024 Summer Interns:
                    <div class="textB2024">
                        Ethan Pakuris, Jared Werts, Ian Whitaker, Evan
                        Comiciotto, Fahd Khan, and
                        <a style="color: white;" id="stName" href="partymode=true">Stephen Trezza</a> <br>

                    </div>
                </div>
            </div>
        </div>



        <div class="collegeGrid" style="background: linear-gradient(to right, #f26522, #ef3b32);">
            <div class="aidenTeam" style="font-size: 50px;"> Team Aiden
                <div>
                    <img id="groupPhoto" class="collegePic2" src="/src/assets/Jared About Page pic.png" />
                    <img class="collegePic1" src="/src/assets/Temple Logo.png">
                </div>
                <div>
                    <img id="groupPhoto" class="collegePic2" src="/src/assets/Stephen About Page Pic.png" />
                    <img class="collegePic1" src="/src/assets/Villanova Logo.png">
                </div>
                <div>
                    <div class="slider">
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/Fahd About Page Pic.png" />
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/More Fahd.png" />
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/Even More Fahd.png" />
                    </div>
                    <img class="collegePic1" src="/src/assets/Northeastern Logo.png">
                    <div class="picFrame"></div>
                    <div class="picFrame2"></div>
                   
                </div>
            </div>
            <div class="breyTeam" style="font-size: 50px;"> Team Brey
                <div>
                    <img class="collegePic1" src="/src/assets/Pitt Logo.png">
                    <img id="groupPhoto" class="collegePic2" src="/src/assets/Evan About Page Pic.png" />
                </div>
                <div>
                    <img class="collegePic1" src="/src/assets/Pitt Logo.png">
                    <img id="groupPhoto" class="collegePic2" src="/src/assets/Ian About Page Pic.png" />
                </div>
                <div>
                    <img class="collegePic1" src="/src/assets/BC Logo.png">
                    <img id="groupPhoto" class="collegePic2" src="/src/assets/Ethan About Page Pic.png" />
                </div>
            </div>
        </div>

        <div style="margin: 3rem;"></div>

        <p id="heading">Old Page (with some tweaks):</p>

        <table id="descriptions" style="color: black;">
            <tr>
                <th id="tableHeading" colspan="4">
                    Core functionality: Gathers server and database information from
                    various hosts, compiles them, and displays them on a webpage.
                </th>
            </tr>
            <tr id="headerLabels">
                <th class="tableLabel">Backend</th>
                <th class="tableLabel">Authentication</th>
                <th class="tableLabel">Frontend</th>
                <th class="talbeLabel">Distribution</th>
            </tr>
            <tr>
                <td class="description">
                    Gathers data from a series of automated Powershell scripts that
                    collect the data and send it to a set host in json format.
                    The host runs a series of programs that compile each set of data
                    into separate lists, checking for outdated information and
                    deleting it. The backend then utilizes the get and post APIs in
                    order to store and transmit the data to the frontend.
                </td>
                <td class="description">
                    Upon frontend fetch request, the login API checks the provided
                    username and password. If they are valid, the API will return a
                    token that is stored in a cookie and passed to authentication
                    API. If the token is valid, the auth API allows the page to
                    load.
                </td>
                <td class="description">
                    Utilizes Vue3 and fetch APIs to retrieve the data from the set
                    host. The data is then displayed in a series of tables which can
                    be filtered through the collapsible sidebar and searched as
                    desired.
                </td>
                <td class="description">
                    The code is all compiled in Docker containers that are hosted
                    and stored on a virtual server in Azure to ensure the programs
                    can run constantly and be accessed as needed.
                </td>
            </tr>
            <tr>
                <td class="people">Jared, Fahd, Ethan</td>
                <td class="people">Stephen</td>
                <td class="people">Evan, Ian, Stephen, Ethan</td>
                <td class="people">Jared</td>
            </tr>
        </table>
        <div style="margin: 3rem;"></div>
        <div class="row">
            <div class="collumn">
                <img id="flowchart" src="/src/assets/IT-Asset-Flowchart.png" @click="resizeFlowChart()" />
                <figcaption>
                    Flowchart showing capabilities and path of data
                </figcaption>
            </div>
            <div class="collumn">
                <img id="groupPhoto" src="/src/assets/Intern-Group-Photo-Good.png" @click="resizePhoto()" />
                <p>
                    Designed by La Salle College High School Class of 2024 Summer
                    Interns
                </p>
                <p class="internList">
                    Members: Ethan Pakuris, Jared Werts, Ian Whitaker, Evan
                    Comiciotto, Fahd Khan, and
                    <a id="stName" href="partymode=true">Stephen Trezza</a>
                </p>
                <p class="finePrint">(From left to right as pictured)</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import notification from "./notification.vue";
const version = ref("");
onMounted(() => {
    version.value = import.meta.env.VITE_APP_VERSION;
});
</script>

<script>
export default {
    methods: {
        resizeFlowChart() {
            if (document !== null) {
                document
                    .getElementById("flowchart")
                    .classList.toggle("small-chart");
            }
        },
        resizePhoto() {
            if (document !== null) {
                document
                    .getElementById("groupPhoto")
                    .classList.toggle("small-photo");
            }
        },
    },
};
</script>

<style scoped>
/* Entry Animation */

.shapes {
    position: relative;
    left: -1350px;
    background-color: #27272d;
    padding: 2rem;
    align-content: center;
    height: 160px;
    width: 1400px;
    border-radius: 1rem;
}

#shapeOne {
    animation: slide .75s forwards;
    animation-delay: 0.5s;
}

#shapeTwo {
    animation: slide .75s forwards;
    animation-delay: 1s;
}

#shapeThree {
    animation: slide .75s forwards;
    animation-delay: 1.5s;
}

#shapeFour {
    animation: slide .75s forwards;
    animation-delay: 2s;
}

@keyframes slide {
    100% {
        left: 0;
    }
}


/* Bootstrap symbol placement */

.symbols {
    background-color: #27272d;
    border-radius: 1rem;
    padding: 1rem;
    display: inline-flex;
    position: relative;
    left: 1275px;
    font-size: 50px;
    bottom: 100px;
    color: #15779f
}

/* The Frames and Text for the Titles */

.textA2023 {
    color: white;
    position: relative;
    right: -130px;
    top: 150px;
    grid-column: 2;
    font-size: large;
    font: bold;
}

.textB2023 {
    font-size: medium;
}

.textA2024 {
    color: white;
    position: relative;
    right: -50px;
    top: 50px;
    grid-column: 2;
    font-size: large;
    font: bold;
}

.textB2024 {
    font-size: medium;
}

.frame {
    background: linear-gradient(to right, #27272d, #34343b, #5d5d6d);
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-right: 1rem;
    /* padding-left: 1rem; */
}

.innerFrame {
    display: inline-flex;
    grid-template-columns: auto auto;
    background: linear-gradient(to right, #f26522, #ef3b32);
    border-radius: 1rem;
    padding: .5rem;
}

/* The 2023 and 2024 title pictures */

.picture2023 {
    border-radius: 5rem;
    position: relative;
    left: 10px;
    top: -5px;
    width: 40% !important;
    grid-column: 1;
}

.picture2024 {
    border-radius: 5rem;
    position: relative;
    left: 10px;
    top: -5px;
    width: 10% !important;
    grid-column: 1;
}

/* All of the College related stuff */

.collegeGrid {
    display: inline-grid;
    grid-template-columns: auto auto;
}

.collegePic1 {
    width: 10% !important;
    position: relative;
    margin: 2rem;
}

.collegePic2 {
    position: relative;
    width: 10% !important;
    align-content: right;
    margin-left: 1rem;
    left: -100px;
}

.picFrame { 
    display: inline-flex;
    width: 200px;
    height: 300px;
    background-color: #27272d;
    position: relative;
    top: -300px;
    left: -120px;
}

.picFrame2 {
    display: inline-flex;
    width: 200px;
    height: 300px;
    background-color: #27272d;
    position: relative;
    top: -300px;
    left: -10px;
}

/* Slideshow Animation Code */

.slider {
    position: relative;
    animation: slideshow 20s ease infinite;
}

@keyframes slideshow {

    20% {
        left: 0px;
    }

    40% {
        left: 100px;
    }

    60% {
        left: 200px;
    }

    80% {
        left: 100px;
    }

    100% {
        left: 0px;
    }

}

/* All of the Newer 2023 project */

.p {
    margin-top: -3rem;
    width: 1000px;
    height: 50px;
    transform: skew(-20deg);
    /* background: linear-gradient(to right, #702b29, #ef3b32, #ce4e47); */
    background: linear-gradient(to right, #27272d, #34343b, #5d5d6d);
    color: #f1f1f1;
    text-align: center;
    padding-top: 11px;
    position: relative;
    left: -10px;
    font-size: large;
}

.innerP {
    background: linear-gradient(to right, #f26522, #ef3b32);
    position: relative;
    left: -8px;
    height: 40px;
    top: -6px;
    align-content: center;
}

.textp {
    text-align: left;
}

.b {
    width: 1000px;
    height: 50px;
    transform: skew(20deg);
    /* background: linear-gradient(to right, #702b29, #ef3b32, #ce4e47); */
    background: linear-gradient(to left, #27272d, #34343b, #5d5d6d);
    color: #f1f1f1;
    text-align: center;
    padding-top: 11px;
    position: relative;
    left: 300px;
    font-size: large;
}

.innerb {
    background: linear-gradient(to left, #f26522, #ef3b32);
    position: relative;
    left: 8px;
    height: 40px;
    top: -6px;
    align-content: center;
}

.textb {
    text-align: right;
}

.name {
    margin-top: 1rem;
    position: relative;
    left: 340px;
}

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
    border-right: 1px solid;
    border-left: 1px solid;
    border-color: #c0c0c0;
    border-collapse: collapse;
}

#heading {
    font-weight: bold;
    font-size: xx-large;
    padding-top: 10px;
    padding-bottom: 10px;
}

#headerLabels {
    background-color: #f1f1f1;
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
    background-color: #f1f1f1;
}

th {
    font-size: large;
}

#tableHeading {
    background-color: white;
    color: #f1f1f1;
    background-color: #ef3b32;
    font-size: larger;
    border: 1px solid;
    border-color: #ef3b32;
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

/* .small-photo {
    width: 40% !important;
    margin-left: 0px;
    margin-right: auto;
} */

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
}
</style>
