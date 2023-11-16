'use client'
import mqtt from 'mqtt'
import { useEffect, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState(''); // Estado para almacenar el mensaje recibido

  const [data, setData] = useState({
    humedad_sustrato: 0,
    humedad_aire: 0,
    temperatura_aire: 0,
    agua_estanque: 0
  })
  
  const clientId = "emqx_next_" + Math.random().toString(16).substring(2, 8);
  const username = "chakalito";
  const password = "chakalito123";

  useEffect(() => {
    const client = mqtt.connect("wss://jf0133e8.ala.us-east-1.emqxsl.com:8084/mqtt", {
      clientId: clientId,
      username: username,
      password: password,
    });

    client.on("connect", () => {
      console.log("connected");
      client.subscribe("test", { qos: 0 }, (error) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        console.log("Subscribed to topic 'test'");
      });
    });

    client.on("message", (topic, msg) => {
      if (topic === "test") {
        getData(msg);
        console.log("message received: ", msg.toString());
      }
    });

    client.on("error", (err) => {
      console.log(err);
    });

    return () => client.end(); // Limpieza al desmontar el componente
  }, []);

  const getData = (msg) => {
    const [humedad_sustrato, humedad_aire, temperatura_aire, agua_estanque] = msg.toString().split(',');
    setData({
      humedad_sustrato: humedad_sustrato,
      humedad_aire: humedad_aire,
      temperatura_aire: temperatura_aire,
      agua_estanque: agua_estanque
    });
  }

    return (
      <div className='flex items-center justify-center min-h-screen bg-green-600'>
        <div className='bg-amber-100 w-1/2 h-1/2 text-green-700 rounded-sm shadow-lg shadow-amber-950 p-8 space-y-6'>
          <h2 className='text-2xl font-bold'>Información planta 🪴</h2>
          <div className='grid grid-cols-2 gap-4'>
            <h1>Humedad sustrato: {data.humedad_sustrato}</h1>
            <h1>Humedad aire: {data.humedad_aire}</h1>
            <h1>Temperatura aire: {data.temperatura_aire}</h1>
            <h1>Agua en estanque: {data.agua_estanque}</h1>
          </div>
        </div>
      </div>
    )
  }
