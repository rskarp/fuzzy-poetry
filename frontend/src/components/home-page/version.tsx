import type { ReactNode } from "react";

interface VersionProps {
    versionName: string;
    children: ReactNode
}

const Version = (props: VersionProps) => {
    
  return (
    <div className="collapse group bg-base-200 rounded-md shadow-lg">
        <input type="checkbox" className="peer" />
        <div
            className="collapse-title text-xl text-primary-content group-hover:bg-primary peer-checked:bg-primary peer-checked:text-secondary-content"
        >
            {props.versionName}
        </div>
        <div className="collapse-content text-primary-content peer-checked:text-secondary-content">
            {props.children}
        </div>
    </div>
  );
};

export default Version;