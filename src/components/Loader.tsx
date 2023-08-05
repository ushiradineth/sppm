import { LoaderIcon } from "lucide-react";

function Loader(props: { background?: boolean }) {
  if (props.background) {
    return (
      <div className="bg-bgc flex h-screen flex-col items-center justify-center">
        <LoaderIcon className="animate-spin" color={"#866A35"} />
      </div>
    );
  }

  return <LoaderIcon className="animate-spin" />;
}

export default Loader;
