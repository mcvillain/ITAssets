<template>
    <notification />
    <div style="background: #f1f1f1; color: white;">
        <div class="frame">
            <div class="innerFrame">
                <img id="groupPhoto" class="picture2023" src="/src/assets/Intern-Group-Photo-Good.png"
                    @click="resizePhoto()" />
                <div class="textA2023">
                    <p id="heading" style="color: white;">2023 IT Asset Project</p>
                    <p style="color: white; font-size: 2rem;">{{ version }}</p>
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
                <div class="name" style="left: 330px;">- Evan, Ian, and Stephen</div>
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

        <div style="margin: 3rem;">
            <img class="flowchart2023" src="/src/assets/IT-Asset-Flowchart.png"  />
            <img class="flowchart2023" src="/src/assets/2023ITAssetsPage.png" />
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
                    <div class="slider">
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/JaredAboutPagePic.png" />
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/MoreFahd.png" />
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/EvenMoreFahd.png" />
                    </div>
                    <img class="collegePic1" src="/src/assets/TempleLogo.png">
                    <div class="picFrame"></div>
                    <div class="picFrame2"></div>
                </div>
                <div>
                    <div class="slider">
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/StephenAboutPagePic.png" />
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/MoreFahd.png" />
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/EvenMoreFahd.png" />
                    </div>
                    <img class="collegePic1" src="/src/assets/VillanovaLogo.png">
                    <div class="picFrame"></div>
                    <div class="picFrame2"></div>
                </div>
                <div>
                    <div class="slider">
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/FahdAboutPagePic.png" />
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/MoreFahd.png" />
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/EvenMoreFahd.png" />
                    </div>
                    <img class="collegePic1" src="/src/assets/NortheasternLogo.png">
                    <div class="picFrame"></div>
                    <div class="picFrame2"></div>

                </div>
            </div>
            <div class="breyTeam" style="font-size: 50px;"> Team Brey
                <div>
                    <img class="collegePic1" src="/src/assets/PittLogo.png">
                    <img id="groupPhoto" class="collegePic2" src="/src/assets/EvanAboutPagePic.png" />
                </div>
                <div>
                    <img class="collegePic1" src="/src/assets/PittLogo.png">
                    <img id="groupPhoto" class="collegePic2" src="/src/assets/IanAboutPagePic.png" />
                </div>
                <div>
                    <img class="collegePic1" src="/src/assets/BC-Logo.png">
                    <img id="groupPhoto" class="collegePic2" src="/src/assets/EthanAboutPagePic.png" />
                </div>
            </div>
        </div>

        <div style="margin: 3rem;"></div>

        <!-- <p id="heading">Old Page (with some tweaks):</p>

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
        </div> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import notification from "./notification.vue";
import "./aboutPage.css";
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


