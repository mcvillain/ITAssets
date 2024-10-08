<template>

    <!-- This line activates the confetti in the background -->

    <div id="confetti"></div>

    <!-- The notification and OutOfDate_notify being called -->

    <notification />
    <ood_notify v-if="ood" />

    <!-- Llama photo -->

    <img id="spin" src="/src/assets/parent.webp" />

    <div class="card text-center m-3">
        <div class="card-body">
            <h1 class="header" v-if="toggleDataTable.value == 'about'"></h1>
            <h1 class="header" v-else-if="toggleDataTable.value == 'database'"></h1>
            <h1 class="header" v-else></h1>
            <div class="search-bar" v-if="toggleDataTable.value != 'about'">
                <input style="color: black;" type="text" v-model="searchKeyword" placeholder="Search Name" />
            </div>
            <div v-if="toggleDataTable.value == 'about'"></div>

            <!-- I assume Aiden tried to create a toggle button to switch between two types of tables (Servers and Databases) 
            But is not implemented within the page itself-->

            <table v-else-if="toggleDataTable.value == 'database'" class="styled-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Size in GB</th>
                        <th>Path</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="database in filteredDatabases" :key="database.name">
                        <td>{{ database.name }}</td>
                        <td>{{ database.size }}</td>
                        <td>{{ database.paths }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Data Table Code (Same as the original 2023 Servers Datatable) -->

            <table v-else="toggleDataTable" class="styled-table">
                <thead>
                    <tr>
                        <th class="vm">VM Name</th>
                        <th class="stat">Status</th>
                        <th class="ip">IP</th>
                        <th class="time">Last Check-In Time</th>
                        <th class="hv">HyperVisor</th>
                        <th class="host">Hostname</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="server in filteredServers" :key="server.VMName">
                        <td>{{ server.VMName }}</td>
                        <td>
                            <div class="running" v-if="server.Status == 'Running'"></div>
                            <div class="offline" v-else></div>
                        </td>
                        <td>{{ server.IP }}</td>
                        <td>{{ server.LastCheckInTime }}</td>
                        <td>{{ server.HyperVisor }}</td>
                        <td>{{ server.Hostname }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    <!-- Slideshow Code -->


    <div class="slideshow">
        <img class="collegePic2" src="/src/assets/JaredAboutPagePic.png" />
        <img class="collegePic2" src="/src/assets/MoreFahd.png" />
        <img class="collegePic2" src="/src/assets/EvanAboutPagePic.png" />
        <img class="collegePic2" src="/src/assets/IanAboutPagePic.png" />
        <img class="collegePic2" src="/src/assets/StephenAboutPagePic.png"
            style="border-radius: 1rem;" />
        <img class="collegePic2" src="/src/assets/EthanAboutPagePic.png" />
        <img class="collegePic2" src="/src/components/router/cheese.gif" />
    </div>


</template>


<script setup href="./confetti.js">//DO NOT REMOVE HREF, Confetti Does not work without it
import { ref, onMounted, computed } from "vue";
import toggleDataTable from "./state.js";
import "./aboutPage.css";
import "https://code.jquery.com/jquery-1.11.0.js"; //DO NOT REMOVE, Confetti Does not work without it
import notification from "./notification.vue";
import ood_notify from './ood_notify.vue';
import router from "./router/index.js";

const searchKeyword = ref("");
var servers = ref(null);
var databases = ref(null);
console.log(toggleDataTable.value);
var ood = false;

// Fetches Data for the Servers Table and Internal DB Table

onMounted(() => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "/servers", {
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            servers.value = data.data;
            ood = data.ood;
        })
        .catch((error) => {
            console.error("Error fetching server data:", error);
        });

    fetch(import.meta.env.VITE_API_ENDPOINT + "/databases", {
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            databases.value = data;
        })
        .catch((error) => {
            console.error("Error fetching database data:", error);
        });
});

// Allows Data to be filtered

const filteredServers = computed(() => {
    if (!searchKeyword.value) {
        return servers.value;
    }
    return servers.value.filter((server) =>
        server.VMName.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
});

const filteredDatabases = computed(() => {
    if (!searchKeyword.value) {
        return databases.value;
    }
    const keywordTwo = searchKeyword.value.toLowerCase();
    return databases.value.filter((databases) =>
        databases.name.toLowerCase().includes(keywordTwo)
    );
});


// All of the Needed JS confetti Code 
// DO NOT REMOVE LINES 158-510, Confetti will not work without it


$(document).ready(function () {
    var frameRate = 30;
    var dt = 1.0 / frameRate;
    var DEG_TO_RAD = Math.PI / 180;
    var RAD_TO_DEG = 180 / Math.PI;
    var colors = [
        ["#df0049", "#660671"],
        ["#00e857", "#005291"],
        ["#2bebbc", "#05798a"],
        ["#ffd200", "#b06c00"]
    ];

    function Vector2(_x, _y) {
        this.x = _x, this.y = _y;
        this.Length = function () {
            return Math.sqrt(this.SqrLength());
        }
        this.SqrLength = function () {
            return this.x * this.x + this.y * this.y;
        }
        this.Equals = function (_vec0, _vec1) {
            return _vec0.x == _vec1.x && _vec0.y == _vec1.y;
        }
        this.Add = function (_vec) {
            this.x += _vec.x;
            this.y += _vec.y;
        }
        this.Sub = function (_vec) {
            this.x -= _vec.x;
            this.y -= _vec.y;
        }
        this.Div = function (_f) {
            this.x /= _f;
            this.y /= _f;
        }
        this.Mul = function (_f) {
            this.x *= _f;
            this.y *= _f;
        }
        this.Normalize = function () {
            var sqrLen = this.SqrLength();
            if (sqrLen != 0) {
                var factor = 1.0 / Math.sqrt(sqrLen);
                this.x *= factor;
                this.y *= factor;
            }
        }
        this.Normalized = function () {
            var sqrLen = this.SqrLength();
            if (sqrLen != 0) {
                var factor = 1.0 / Math.sqrt(sqrLen);
                return new Vector2(this.x * factor, this.y * factor);
            }
            return new Vector2(0, 0);
        }
    }
    Vector2.Lerp = function (_vec0, _vec1, _t) {
        return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
    }
    Vector2.Distance = function (_vec0, _vec1) {
        return Math.sqrt(Vector2.SqrDistance(_vec0, _vec1));
    }
    Vector2.SqrDistance = function (_vec0, _vec1) {
        var x = _vec0.x - _vec1.x;
        var y = _vec0.y - _vec1.y;
        return (x * x + y * y + z * z);
    }
    Vector2.Scale = function (_vec0, _vec1) {
        return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
    }
    Vector2.Min = function (_vec0, _vec1) {
        return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
    }
    Vector2.Max = function (_vec0, _vec1) {
        return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
    }
    Vector2.ClampMagnitude = function (_vec0, _len) {
        var vecNorm = _vec0.Normalized;
        return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
    }
    Vector2.Sub = function (_vec0, _vec1) {
        return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
    }

    function EulerMass(_x, _y, _mass, _drag) {
        this.position = new Vector2(_x, _y);
        this.mass = _mass;
        this.drag = _drag;
        this.force = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
        this.AddForce = function (_f) {
            this.force.Add(_f);
        }
        this.Integrate = function (_dt) {
            var acc = this.CurrentForce(this.position);
            acc.Div(this.mass);
            var posDelta = new Vector2(this.velocity.x, this.velocity.y);
            posDelta.Mul(_dt);
            this.position.Add(posDelta);
            acc.Mul(_dt);
            this.velocity.Add(acc);
            this.force = new Vector2(0, 0);
        }
        this.CurrentForce = function (_pos, _vel) {
            var totalForce = new Vector2(this.force.x, this.force.y);
            var speed = this.velocity.Length();
            var dragVel = new Vector2(this.velocity.x, this.velocity.y);
            dragVel.Mul(this.drag * this.mass * speed);
            totalForce.Sub(dragVel);
            return totalForce;
        }
    }

    function ConfettiPaper(_x, _y) {
        this.pos = new Vector2(_x, _y);
        this.rotationSpeed = Math.random() * 600 + 800;
        this.angle = DEG_TO_RAD * Math.random() * 360;
        this.rotation = DEG_TO_RAD * Math.random() * 360;
        this.cosA = 1.0;
        this.size = 5.0;
        this.oscillationSpeed = Math.random() * 1.5 + 0.5;
        this.xSpeed = 40.0;
        this.ySpeed = Math.random() * 60 + 50.0;
        this.corners = new Array();
        this.time = Math.random();
        var ci = Math.round(Math.random() * (colors.length - 1));
        this.frontColor = colors[ci][0];
        this.backColor = colors[ci][1];
        for (var i = 0; i < 4; i++) {
            var dx = Math.cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
            var dy = Math.sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
            this.corners[i] = new Vector2(dx, dy);
        }
        this.Update = function (_dt) {
            this.time += _dt;
            this.rotation += this.rotationSpeed * _dt;
            this.cosA = Math.cos(DEG_TO_RAD * this.rotation);
            this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt
            this.pos.y += this.ySpeed * _dt;
            if (this.pos.y > ConfettiPaper.bounds.y) {
                this.pos.x = Math.random() * ConfettiPaper.bounds.x;
                this.pos.y = 0;
            }
        }
        this.Draw = function (_g) {
            if (this.cosA > 0) {
                _g.fillStyle = this.frontColor;
            } else {
                _g.fillStyle = this.backColor;
            }
            _g.beginPath();
            _g.moveTo(this.pos.x + this.corners[0].x * this.size, this.pos.y + this.corners[0].y * this.size * this.cosA);
            for (var i = 1; i < 4; i++) {
                _g.lineTo(this.pos.x + this.corners[i].x * this.size, this.pos.y + this.corners[i].y * this.size * this.cosA);
            }
            _g.closePath();
            _g.fill();
        }
    }
    ConfettiPaper.bounds = new Vector2(0, 0);

    function ConfettiRibbon(_x, _y, _count, _dist, _thickness, _angle, _mass, _drag) {
        this.particleDist = _dist;
        this.particleCount = _count;
        this.particleMass = _mass;
        this.particleDrag = _drag;
        this.particles = new Array();
        var ci = Math.round(Math.random() * (colors.length - 1));
        this.frontColor = colors[ci][0];
        this.backColor = colors[ci][1];
        this.xOff = Math.cos(DEG_TO_RAD * _angle) * _thickness;
        this.yOff = Math.sin(DEG_TO_RAD * _angle) * _thickness;
        this.position = new Vector2(_x, _y);
        this.prevPosition = new Vector2(_x, _y);
        this.velocityInherit = Math.random() * 2 + 4;
        this.time = Math.random() * 100;
        this.oscillationSpeed = Math.random() * 2 + 2;
        this.oscillationDistance = Math.random() * 40 + 40;
        this.ySpeed = Math.random() * 40 + 80;
        for (var i = 0; i < this.particleCount; i++) {
            this.particles[i] = new EulerMass(_x, _y - i * this.particleDist, this.particleMass, this.particleDrag);
        }
        this.Update = function (_dt) {
            var i = 0;
            this.time += _dt * this.oscillationSpeed;
            this.position.y += this.ySpeed * _dt;
            this.position.x += Math.cos(this.time) * this.oscillationDistance * _dt;
            this.particles[0].position = this.position;
            var dX = this.prevPosition.x - this.position.x;
            var dY = this.prevPosition.y - this.position.y;
            var delta = Math.sqrt(dX * dX + dY * dY);
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            for (i = 1; i < this.particleCount; i++) {
                var dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
                dirP.Normalize();
                dirP.Mul((delta / _dt) * this.velocityInherit);
                this.particles[i].AddForce(dirP);
            }
            for (i = 1; i < this.particleCount; i++) {
                this.particles[i].Integrate(_dt);
            }
            for (i = 1; i < this.particleCount; i++) {
                var rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
                rp2.Sub(this.particles[i - 1].position);
                rp2.Normalize();
                rp2.Mul(this.particleDist);
                rp2.Add(this.particles[i - 1].position);
                this.particles[i].position = rp2;
            }
            if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
                this.Reset();
            }
        }
        this.Reset = function () {
            this.position.y = -Math.random() * ConfettiRibbon.bounds.y;
            this.position.x = Math.random() * ConfettiRibbon.bounds.x;
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            this.velocityInherit = Math.random() * 2 + 4;
            this.time = Math.random() * 100;
            this.oscillationSpeed = Math.random() * 2.0 + 1.5;
            this.oscillationDistance = Math.random() * 40 + 40;
            this.ySpeed = Math.random() * 40 + 80;
            var ci = Math.round(Math.random() * (colors.length - 1));
            this.frontColor = colors[ci][0];
            this.backColor = colors[ci][1];
            this.particles = new Array();
            for (var i = 0; i < this.particleCount; i++) {
                this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
            }
        }
        this.Draw = function (_g) {
            for (var i = 0; i < this.particleCount - 1; i++) {
                var p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
                var p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
                if (this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
                    _g.fillStyle = this.frontColor;
                    _g.strokeStyle = this.frontColor;
                } else {
                    _g.fillStyle = this.backColor;
                    _g.strokeStyle = this.backColor;
                }
                if (i == 0) {
                    _g.beginPath();
                    _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
                    _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
                    _g.lineTo((this.particles[i + 1].position.x + p1.x) * 0.5, (this.particles[i + 1].position.y + p1.y) * 0.5);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                    _g.beginPath();
                    _g.moveTo(p1.x, p1.y);
                    _g.lineTo(p0.x, p0.y);
                    _g.lineTo((this.particles[i + 1].position.x + p1.x) * 0.5, (this.particles[i + 1].position.y + p1.y) * 0.5);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                } else if (i == this.particleCount - 2) {
                    _g.beginPath();
                    _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
                    _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
                    _g.lineTo((this.particles[i].position.x + p0.x) * 0.5, (this.particles[i].position.y + p0.y) * 0.5);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                    _g.beginPath();
                    _g.moveTo(p1.x, p1.y);
                    _g.lineTo(p0.x, p0.y);
                    _g.lineTo((this.particles[i].position.x + p0.x) * 0.5, (this.particles[i].position.y + p0.y) * 0.5);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                } else {
                    _g.beginPath();
                    _g.moveTo(this.particles[i].position.x, this.particles[i].position.y);
                    _g.lineTo(this.particles[i + 1].position.x, this.particles[i + 1].position.y);
                    _g.lineTo(p1.x, p1.y);
                    _g.lineTo(p0.x, p0.y);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                }
            }
        }
        this.Side = function (x1, y1, x2, y2, x3, y3) {
            return ((x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2));
        }
    }
    confetti = {};
    confetti.Context = function (parent) {
        var i = 0;
        ConfettiRibbon.bounds = new Vector2(0, 0);
        var canvasParent = document.getElementById(parent);
        var canvas = document.createElement('canvas');
        canvas.width = canvasParent.offsetWidth;
        canvas.height = canvasParent.offsetHeight;
        canvasParent.appendChild(canvas);
        var context = canvas.getContext('2d');
        var interval = null;
        var confettiRibbonCount = 7;
        var rpCount = 30;
        var rpDist = 8.0;
        var rpThick = 8.0;
        var confettiRibbons = new Array();
        ConfettiRibbon.bounds = new Vector2(canvas.width, canvas.height);
        for (i = 0; i < confettiRibbonCount; i++) {
            confettiRibbons[i] = new ConfettiRibbon(Math.random() * canvas.width, -Math.random() * canvas.height * 2, rpCount, rpDist, rpThick, 45, 1, 0.05);
        }
        var confettiPaperCount = 25;
        var confettiPapers = new Array();
        ConfettiPaper.bounds = new Vector2(canvas.width, canvas.height);
        for (i = 0; i < confettiPaperCount; i++) {
            confettiPapers[i] = new ConfettiPaper(Math.random() * canvas.width, Math.random() * canvas.height);
        }
        this.resize = function () {
            canvas.width = canvasParent.offsetWidth;
            canvas.height = canvasParent.offsetHeight;
            ConfettiPaper.bounds = new Vector2(canvas.width, canvas.height);
            ConfettiRibbon.bounds = new Vector2(canvas.width, canvas.height);
        }
        this.start = function () {
            this.stop()
            var context = this
            this.interval = setInterval(function () {
                confetti.update();
            }, 1000.0 / frameRate)
        }
        this.stop = function () {
            clearInterval(this.interval);
        }
        this.update = function () {
            var i = 0;
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (i = 0; i < confettiPaperCount; i++) {
                confettiPapers[i].Update(dt);
                confettiPapers[i].Draw(context);
            }
            for (i = 0; i < confettiRibbonCount; i++) {
                confettiRibbons[i].Update(dt);
                confettiRibbons[i].Draw(context);
            }
        }
    }
    var confetti = new confetti.Context('confetti');
    confetti.start();
    $(window).resize(function () {
        confetti.resize();
    });
});

</script>

<style>


/* calls the confetti within the actual page. also has the color of what the background is */


#confetti {
    background: linear-gradient(to right, #2e5fe5, #a200ff);
    height: 100%;
    left: 0px;
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 0;
}


/* defines the spin animation for the fortnite llama */


#spin {
    position: relative;
     z-index: 1; /* Puts the llama infront of the background */
}

#spin:hover {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}


 /* All of the css for the datatable */


.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    margin-left: auto;
    margin-right: auto;
    position: relative;
    z-index: 1; /* Puts the table infront of the background */
}

.running {
    width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
    background-color: lime;
    margin: auto;
}

.offline {
    width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
    background-color: red;
    margin: auto;
}

.search-bar {
    border: 1px solid rgb(206, 206, 206);
    background-color: #f3f5ff;
    width: 195px;
    margin-left: 10px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    z-index: 1; /* Puts the search bar infront of the background */
    border-radius: 1rem;
}

input[type="text"] {
    text-align: center;
}


/* All the code that darkens the header when your mouse hovers over it */


.vm:hover {
    background-color: #3a25af;
    scale: 105%;
    transition: ease 0.5s;
}

.stat:hover {
    background-color: #3a25af;
    scale: 105%;
    transition: ease 0.5s;
}

.ip:hover {
    background-color: #3a25af;
    scale: 105%;
    transition: ease 0.5s;
}

.time:hover {
    background-color: #3a25af;
    scale: 105%;
    transition: ease 0.5s;
}

.hv:hover {
    background-color: #3a25af;
    scale: 105%;
    transition: ease 0.5s;
}

.host:hover {
    background-color: #3a25af;
    scale: 105%;
    transition: ease 0.5s;
}


/* what defines the natural color of the header */


.styled-table thead tr {
    background-color: #2e50e9;
    color: #ffffff;
    text-align: center;
}


/* Defines the color for the body of the table */


.styled-table tbody tr:nth-of-type(even):focus {
    background-color: #f3f3f3;
}

.styled-table th,
.styled-table td {
    padding: 12px 15px;
}

.styled-table tbody tr:nth-of-type(red) {
    background-color: #eb9696;
}

.styled-table tbody tr {
    background-color: #e0e0e0;
    border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
    background-color: #ffffff;
    border-bottom: 2px solid #2e50e9;
}

.styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}

h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}

</style>
