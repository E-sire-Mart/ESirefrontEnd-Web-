import { Link } from "react-router-dom";

const Breadcrumb = (props: any) => {
  const { category, name } = props;

  return (
    <div className="text-xs flex flex-wrap text-black font-medium">
      <span className="cursor-pointer hover:text-[#0c831f]">
        <Link to="/">Home</Link>
      </span>
      <span>&nbsp; / &nbsp;</span>
      <span className="cursor-pointer hover:text-[#0c831f]">
        <Link to="/">shop name</Link>
      </span>
      <span>&nbsp; / &nbsp;</span>
      <span className="_text-muted">{name}</span>
    </div>
  );
};

export default Breadcrumb;
