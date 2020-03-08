# Goldilocks 🐻

Raspberry Pi project to monitor and control temperature of fermentation jars in a box. The best lacto-ferments occur around 19°C-21°C which can be hard to achieve in Britain - particularly in winter.

🚨 Work in progress

## Shopping List

- Raspberry Pi
- DS18B20 Waterproof Digital Temperature Sensor
- 4.7k Resistor
- Breadboard Kit
- Electronics-Salon RPi Power Relay Board Expansion Module
- Heating element (TBC)
- Container (TBC)
- Thermal insulation
- M-M, M-F jumper wires
- 6 way terminal block (or WAGOs)
- Mains cabling
- Plugs and sockets

## Hardware

A DS18B20 is placed in an insulated box/container with fermentation jars and a heating element. These are attached to the RPi which monitors the temperature and turns on the heater if it drops too low.

> **Currently heating only**: I will have active cooling soon, but not until UK Summer 😎.

As the heater can only be on or off (no temp control) I can't PID control so we're using [bang-bang](https://en.wikipedia.org/wiki/Bang%E2%80%93bang_control)

The temperature sensor is setup following the instructions at [Circuit Basics](https://www.circuitbasics.com/raspberry-pi-ds18b20-temperature-sensor-tutorial/).

I learnt about the relay setup from this [Explaining Computers video](https://youtu.be/bOGltcgiXiU).

## Software

There's 2 projects in this repo, `pi/` which has the code running on the RPi and `/dashboard` which displays the sampled data from the RPi so I can monitor; this is useful for tweaking the control algorithm.

> ⚠️ **The RPi code is JavaScript, not Python**: I know that's illegal, I don't care -- I don't know Python well enough to risk burning down my flat.

### Pi

Node application that reads the temperature from `/sys/bus/w1/devices/` which is written by the RPi using 1-wire protocol. It turns on/off a relay attached to the RPi based on the current temperature. It also writes all the sample data and current time to an AWS DynamoDB so it can be queried externally.

> 📝 **TODO multiple sensors**: I want to experiment with having sensors in water and in the air to see how much difference the high heat capacity of water makes in temperature lag.

### Dashboard

A chart and a table showing basic information about time and temperature using [React Material-UI](https://material-ui.com/)

## Disclaimer

I don't know what I'm doing. I'm learning almost everything as I go. So far I've not electrocuted myself or shorted my flat but past success is no indication of future success.
