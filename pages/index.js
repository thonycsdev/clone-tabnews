import { useState } from "react";

function Home() {
    const [isShown, setIsShown] = useState(false);
    return(
    <main>
        <button onClick={() => setIsShown(!isShown)}>Palloma, Clique Aqui!!</button>
        {isShown ? <h1>EU TE AMO DEMAIS, VOCE EH O AMOR DA MINHA VIDA!!</h1> : <h1>Clica ai</h1>}
    </main>
    );
}

export default Home;