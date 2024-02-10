import Header from "./Header";

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto mt-16 px-4">
        {" "}
        {/* Add margin-top to push the content below the header */}
        <h1>Log In</h1>
      </div>
    </div>
  );
};

export default Home;
