let uri = './real_data.json';
let req = new Request(uri, { method: 'GET' });
let container, docfrag;

document.addEventListener('DOMContentLoaded', init);

function init() {
    container = document.getElementById('container');
    docfrag = new DocumentFragment();

    fetch(req)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('BAD HTTP');
            }
        }).then((json) => {
            json.hourly.data.forEach((hour) => {
                let div = document.createElement('div');
                div.classList.add('hour');
                let timestamp = hour.time;
                div.id = 'ts_' + timestamp.toString();
                let temp = parseInt(hour.temperature);
                div.textContent = temp.toString().concat('\u00B0');
                div.title = hour.summary;
                let span = document.createElement('span');
                let tim = new Date(timestamp * 1000);
                span.textContent = tim.getHours().toString().concat(":00");
                div.appendChild(span);
                docfrag.appendChild(div);
            });
            container.appendChild(docfrag);

            json.hourly.data.filter((hour) => {
                if (hour.precipProbability > 0.5) {
                    return true;
                }
                return false;
            }).map((hour) => {
                return hour.time;
            }).forEach((timestamp) => {
                let id = 'ts_'.concat(timestamp);
                document.getElementById(id).classList.add('precip');
            });

            let highstnum = json.hourly.data.reduce((accumulator, hour) => {
                if (hour.temperature > accumulator.temp) {
                    return { temp: hour.temperature, time: hour.time };
                } else {
                    return accumulator;
                }
            }, { temp: -100, time: 1000 })
            let id = 'ts_' + highstnum.time;
            document.getElementById(id).classList.add('hot');

        })
        .catch((err) => {
            console.log(err.message);
        })

}

