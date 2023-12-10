import { useEffect, useState } from "react";
import io from 'socket.io-client';

/**Configuacion Inicial de Socket.io
 * Analogo a la conexion
 */
const socket = io('http://localhost:8888', {
  withCredentials: false
});


export default function Chat() {
  /**se almacenan todos los mensajes  */
  const [messages, setMessages] = useState([]);

  /**almacenar mensaje actual que se enviara */
  const [message, setMessage] = useState("");

  /**useEffect se usa para configurar el evento message de Socket.IO al montar el componente y limpiarlo al desmontarlo. */
  useEffect(() => {

    /**`receiveMessage` es una función que se llama cuando se recibe un nuevo mensaje. 
     * Actualiza el estado messages con el mensaje recibido. */
    socket.on("message", receiveMessage)

    return () => {
      socket.off("message", receiveMessage);
    };
  }, []);

  /**Esta función actualiza el estado messages, agregando el mensaje recibido al principio del array. */
  const receiveMessage = (message) =>
    setMessages(state => [message, ...state]);


  const handleSubmit = (event) => {
    event.preventDefault();
    
    /**mensaje a enviar */
    const newMessage = {
      body: message,
      from: "YO",//destinatario
    };

    setMessages(state => [newMessage, ...state]);
    setMessage("");
    
    /**enviar mensaje */
    socket.emit("message", newMessage.body);
    console.log("message:",newMessage);
  };

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2">CHAT UNAH</h1>
        <input
          name="message"
          type="text"
          placeholder="Escribe tu mensaje..."
          onChange={(e) => setMessage(e.target.value)}
          className="border-2 border-zinc-500 p-2 w-full text-black"
          value={message}
          autoFocus
        />

        <ul className="h-80 overflow-y-auto">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`my-2 p-2 table text-sm rounded-md ${message.from === "YO" ? "bg-sky-700 ml-auto" : "bg-black"
                }`}
            >
              <b>{message.from}</b>:{message.body}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}
