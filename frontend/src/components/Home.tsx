import React from "react";
import Main from "./Main";
import Header from "./Header";
import Leftside from "./Leftside";

const Home: React.FC = () => {
  return (
    <div className="flex flex-wrap">
      {/* Leftmost column */}
      <div className="w-full md:w-1/3">
        <Leftside />
      </div>

      {/* Center column */}
      <div className="w-full md:w-1/3">
        <Main />
      </div>

      {/* Rightmost column */}
      <div className="w-full md:w-1/3"></div>

      {/* <Header /> can be placed outside the flex layout if you want it to span the entire width */}
      <Header />
    </div>
  );
};

export default Home;
