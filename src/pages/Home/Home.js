import Header from "../Header.js";
import "./Home.css";

function Home() {
  return (
    <div
      style={{ width: "100vw", height: "100vh", backgroundColor: "#222222" }}
      className="home"
    >
      <Header title="DSAV" />
      <div className="home_subtitle">
        Data Structures & Algorithms Made Easy !!!
      </div>
      <div className="home-content">
        Visualize <fd className="emph1">Graph Theory</fd> Algorithms, Common{" "}
        <fd className="emph2">Data Structures</fd>, and{" "}
        <fd className="emph3">Sorting Algorithms</fd> in an intuitive and{" "}
        interactive way. Click on one of the menu items above or below to get{" "}
        started.
      </div>
      <div className="home_features">
        <div className="home_features_title f1">Graph Theory</div>
        <div className="home_features_description f1">
          Visualize graph theory algorithms such as Depth First Search, Breadth
          First Search, Dijkstra's Algorithm, and Prim's Algorithm.
        </div>

        <div className="home_features_title f2">Data Structures</div>
        <div className="home_features_description f2">
          Visualize common data structures such as Linked List, Stack, Queue,
          Binary Search Tree, and AVL Tree.
        </div>
        <div className="home_features_title f3">Sorting Algorithms</div>
        <div className="home_features_description f3">
          Visualize sorting algorithms such as Bubble Sort, Selection Sort,
          Insertion Sort, Merge Sort, and Quick Sort.
        </div>
      </div>
    </div>
  );
}

export default Home;
