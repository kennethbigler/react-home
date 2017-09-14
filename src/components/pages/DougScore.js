import React from "react";
import DS from "../../constants/dougscore";
// https://react-table.js.org/#/story/readme
import ReactTable from "react-table";
import "react-table/react-table.css";

const DougScore = props => {
  const columns = [
    { Header: "Vehicle", accessor: "model", minWidth: 78 },
    { Header: "Styling", accessor: "styling", minWidth: 44 },
    { Header: "Acceleration", accessor: "acceleration", minWidth: 46 },
    { Header: "Handling", accessor: "handling", minWidth: 54 },
    { Header: "Cool Factor", accessor: "coolFactor", minWidth: 50 },
    { Header: "Importance", accessor: "importance", minWidth: 54 },
    {
      id: "weekendScore",
      Header: "Weekend Score",
      minWidth: 56,
      accessor: s =>
        s.styling + s.acceleration + s.handling + s.coolFactor + s.importance
    },
    { Header: "Features", accessor: "features", minWidth: 48 },
    { Header: "Comfort", accessor: "comfort", minWidth: 56 },
    { Header: "Quality", accessor: "quality", minWidth: 50 },
    { Header: "Practical", accessor: "practical", minWidth: 50 },
    { Header: "Value", accessor: "value", minWidth: 40 },
    {
      id: "dailyScore",
      Header: "Daily Score",
      minWidth: 52,
      accessor: s => s.features + s.comfort + s.quality + s.practical + s.value
    },
    {
      id: "dougScore",
      Header: "Doug Score",
      minWidth: 54,
      accessor: s =>
        s.styling +
        s.acceleration +
        s.handling +
        s.coolFactor +
        s.importance +
        s.features +
        s.comfort +
        s.quality +
        s.practical +
        s.value
    }
  ];

  const pageSizes = [
    Math.ceil(DS.length / 4),
    Math.ceil(DS.length / 3),
    Math.ceil(DS.length / 2),
    DS.length
  ];

  const styles = {
    position: "absolute",
    top: 79,
    bottom: 15,
    left: 15,
    right: 15
  };

  const defaultSort = [{ id: "dougScore", desc: true }];

  return (
    <ReactTable
      className="-striped -highlight"
      pageSizeOptions={pageSizes}
      defaultPageSize={DS.length}
      data={DS}
      columns={columns}
      resizable={false}
      style={styles}
      defaultSorted={defaultSort}
    />
  );
};

export default DougScore;
