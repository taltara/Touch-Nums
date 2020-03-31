
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getRandomColor(change = 0) {

    var randomColor = [
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255)
    ];

    for (var i = 0; i < 3; i++) {

        if (randomColor[i] + change > 255) randomColor[i] = 255;
        else if (randomColor[i] + change < 0) randomColor[i] = 0;
    }

    return "#" + componentToHex(randomColor[0]) + componentToHex(randomColor[1]) + componentToHex(randomColor[2]);
}

function createParticles(level) {

    var change = (level === 1) ? 0 : (level === 2) ? -50 : -150; 

    var randomColor = getRandomColor(change);
    var randomLineColor = getRandomColor(change);
    

    switch (level) {

        case 1:

            break;

        case 2:

            break;

        case 3:

            break;
    }

    particlesJS('particles-js',

        {
            "particles": {
                "number": {
                    "value": (level === 3) ? 200 : 300,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": randomColor
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                
                },
                "opacity": {
                    "value": (level === 3) ? 1 : 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 175,
                    "color": randomLineColor,
                    "opacity": (level === 3) ? 1 : 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": (level === 3) ? 8 : 6,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        }
    )

}

