import React from "react";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import Constanst from "@/app/data/Constanst";
import { atomDark } from "@codesandbox/sandpack-themes";

function CodeEditor({ codeRes, isReady }: any) {
  return (
    <div className="mt-3 shadow-lg mr-3">
      {isReady ? (
        <Sandpack
          template="react"
          theme={atomDark}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            showNavigator: true,
            showTabs: true,
            editorHeight: 580,
          }}
          customSetup={{
            dependencies: {
              ...Constanst.DEPENDANCY,
            },
          }}
          files={{
            "/App.js": `${codeRes}`,
          }}
        />
      ) : (
        <SandpackProvider
          template="react"
          theme={atomDark}
          files={{
            "/App.js": {
              code: codeRes,
              active: true,
            },
          }}
          customSetup={{
            dependencies: {
              ...Constanst.DEPENDANCY,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout>
            <SandpackCodeEditor showTabs={true} style={{ height: "84vh" }} />
          </SandpackLayout>
        </SandpackProvider>
      )}
    </div>
  );
}

export default CodeEditor;
