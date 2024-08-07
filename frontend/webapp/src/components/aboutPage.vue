<template>
    <notification />

    <!-- 2023 About Page -->

    <div style="background: #f1f1f1; color: white;">
        <div class="frame">
            <div class="innerFrame">
                <img id="groupPhoto" class="picture2023" src="/src/assets/Intern-Group-Photo-Good.png"
                    @click="resizePhoto()" />
                <div class="textA2023">
                    <p class="heading" style="color: white;">2023 IT Asset Project</p>
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

        <!-- Descriptions for the 2023 It Assets Page: -->

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
            <img class="flowchart2023" src="/src/assets/IT-Asset-Flowchart.png" />
            <img class="page2023" src="/src/assets/2023ITAssetsPage.png" />
        </div>

        <!-- 2024 About Page: -->

        <div class="frame">
            <div class="innerFrame">
                <img id="groupPhoto" class="picture2024" src="/src/assets/groupPhoto2024.jpg" />
                <div class="textA2024">
                    <p class="heading" style="color: white;">2024 IT Asset Project</p>
                    <p style="color: white; font-size: 2rem;">{{ version }}</p>
                    Designed by the Aegis Software 2024 Summer Interns:
                    <div class="textB2024">
                        Aiden Sheeran, Brey Rivera, Ethan Pakuris, Jared Werts, Ian Whitaker, Evan
                        Comiciotto, Fahd Khan, and
                        <a style="color: white;" id="stName" href="partymode=true">Stephen Trezza</a> <br>

                    </div>
                </div>
            </div>
        </div>

        <!-- Description for what the two teams did during their internship  -->
        <!-- Pay No attention to the class names. When I originally made it the names made sense -->

        <div class="teams">
            <div class="aiden">
                <div class="teamFrameOrange"> Team Aiden
                    <div class="textB2024" style="line-height: 2;">

                        <!-- Team Description Goes Here: -->

                        

                        We have two types of customers:

                        AIS/AZ customers who interact with our system via the AIS/AZ Customer_Facing Services to
                        upload their files.
                        ITAR Customers who deal with sensitive data. They use the
                        AIS/AZ Traffic_Facing Services which ensures compliance with ITAR regulations. <br> <br>

                        Our system utilizes two distinct cloud storage solutions: <br>

                        Azure: For our regular AIS/AZ customers, providing reliable and scalable storage. <br>
                        Azure Government SMB: A specialized solution for our ITAR customers, offering enhanced security
                        features to meet strict regulatory requirements. <br> <br>

                        Once the files are uploaded, they are handled by our Uploader
                        Service. This service is the backbone of our system, ensuring that files are processed and
                        stored correctly in our Checkout Data database.

                    </div>
                </div>
            </div>
            <div class="brey">
                <div class="teamFrameWhite">
                    <div class="textB2024">
                        <img class="aidenflowchart2024" src="/src/assets/uploaderFlowChart.png">
                    </div>
                </div>
            </div>
        </div>

        <div class="teams" style="padding-top: 1rem;">
            <div class="brey">
                <div class="teamFrameOrange" style="background: white;">
                    <div class="textB2024">
                        <img class="breyflowchart2024" src="/src/assets/teamBreyFlowChart.png">
                    </div>
                </div>
            </div>
            <div class="aiden">
                <div class="teamFrameWhite" style="background: linear-gradient(to right, #f26522, #ef3b32);"> Team Brey
                    <div class="textB2024">

                        <!-- Team Description Goes Here: -->

                        Saas Page

                    </div>
                </div>
            </div>
        </div>

        <!-- Where the Interns are going to College -->

        <div class="college" style="background: linear-gradient(to right, #27272d, #34343b, #5d5d6d);">
            <div class="collegeFrame"> Where Our Interns Went to College:
                <div>
                    <img class="collegePic1" src="/src/assets/NortheasternLogo.png">
                    <img class="collegePic1" src="/src/assets/TempleLogo.png">
                    <img class="collegePic1" src="/src/assets/VillanovaLogo.png">
                    <img class="collegePic1" src="/src/assets/PittLogo.png">
                </div>
                <div>
                    <img class="collegePic1" src="/src/assets/BC-Logo.png">
                    <img src="/src/assets/arcadia-university-logo.png" style="margin-bottom: 2rem;">
                    <img class="collegePic1" src="/src/assets/gwynedd.png" style="margin-bottom: 0rem;">
                </div>
            </div>
        </div>

        <div class="collegeGrid" style="background: linear-gradient(to right, #f26522, #ef3b32);">
            <div class="aidenTeam" style="font-size: 50px;">

                <div>
                    <div class="slider">
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/JaredAboutPagePic.png" />
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/MoreFahd.png" />
                        <img id="groupPhoto" class="collegePic2" src="/src/assets/EvenMoreFahd.png" />
                    </div>
                    
                    <div class="picFrame"></div>
                    <div class="picFrame2"></div>
                </div>
            </div>
        </div>

        <div style="margin: 3rem;"></div>

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
