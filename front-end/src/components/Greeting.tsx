import { useState, useEffect } from "react";

const Greeting = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    let greetingMessage = "";

    if (hours < 12) greetingMessage = "Good Morning";
    else if (hours < 18) greetingMessage = "Good Afternoon";
    else greetingMessage = "Good Evening";

    setGreeting(`${greetingMessage} User! :D`);
  }, []);

  return (
    <div className="animate-fadeinout text-gray-500 font-medium text-sm sm:text-lg md:text-xl text-center whitespace-nowrap">
      {greeting}
    </div>
  );
};


export default Greeting;
