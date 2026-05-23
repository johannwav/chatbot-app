import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll automático al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Conexión con el servidor backend
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const botMessage = { text: response.data.reply, isBot: true };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Hubo un error al conectar con el servidor. 😢", isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-neutral-100 font-sans">
      {/* Encabezado */}
      <header className="p-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur text-center shadow-md">
        <h1 className="text-xl font-semibold tracking-wide text-teal-400">ChatGPT Mini 🤖</h1>
        <p className="text-xs text-neutral-400">React + Node.js + Tailwind v4</p>
      </header>

      {/* Caja de mensajes */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl w-full mx-auto scrollbar-thin">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.isBot
                  ? "bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700/50"
                  : "bg-teal-600 text-white rounded-tr-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Indicador de que el bot está pensando */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 text-neutral-400 px-4 py-3 rounded-2xl rounded-tl-none text-sm border border-neutral-700/50 animate-pulse">
              Escribiendo...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Formulario de entrada */}
      <footer className="p-4 border-t border-neutral-800 bg-neutral-900/50 backdrop-blur">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje... (Prueba con 'hola', 'nombre' o 'adiós')"
            className="flex-1 bg-neutral-800 text-neutral-100 px-4 py-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-teal-500 text-sm transition-colors"
          />
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 text-sm shadow-lg shadow-teal-600/20"
            disabled={loading}
          >
            Enviar
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;