import React from "react";
import Filter from "./Filter";
import FilterTags from "./FilterTags";
import List from "./List";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import SortOptions from "./SortOptions";

const Docs: React.FC = () => {
  return (
    <section>
      <SearchBar />
      <Filter />
      <FilterTags />
      <SortOptions />
      <List />
      <Pagination />
    </section>
  );
};

export default Docs;
