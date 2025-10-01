import { Link } from "react-router-dom";

const Breadcrumb = (props: any) => {
  const { category, name } = props;

  return (
    <div className="text-xs flex flex-wrap text-black dark:text-gray-300 font-medium">
      <span className="cursor-pointer hover:text-[#0c831f] dark:hover:text-green-300">
        <Link to="/">Home</Link>
      </span>
      <span>&nbsp; / &nbsp;</span>
      <span className="cursor-pointer hover:text-[#0c831f] dark:hover:text-green-300">
        <Link to="/">shop name</Link>
      </span>
      <span>&nbsp; / &nbsp;</span>
      <span className="_text-muted dark:text-gray-200">{name}</span>
    </div>
  );
};

export default Breadcrumb;
