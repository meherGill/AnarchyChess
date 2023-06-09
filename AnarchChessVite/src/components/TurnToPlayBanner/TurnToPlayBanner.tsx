import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { PlayerColor } from "@shared/enums";
import { TurnToPlayContext } from "../../shared/Contexts/TurnToPlayContext";
import { Tooltip } from "react-tooltip";

export default () => {
    const TurnToPlayValue = useContext(TurnToPlayContext);
    // const bgToUseRef = useRef<string>("bg-grey-100");
    const [styleToUse, setStlyeToUse] = useState({
        bgColor: "bg-gray-100",
        txtColor: "text-black",
        border: "border-2 border-slate-950",
    });

    const bannerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (TurnToPlayValue.turnToPlay === PlayerColor.white) {
            // bgToUseRef.current = "bg-grey-100";
            setStlyeToUse({
                bgColor: "bg-gray-100",
                txtColor: "text-black",
                border: "border-2 border-slate-950",
            });
        } else {
            // bgToUseRef.current = "bg-slate-800";
            setStlyeToUse({
                bgColor: "bg-slate-800",
                txtColor: "text-white",
                border: "border-2 border-grey-50",
            });
        }
    }, [TurnToPlayValue.turnToPlay]);

    return (
        <div className="p-2 flex items-center flex-col justify-between">
            <div
                ref={bannerRef}
                className={`${styleToUse.bgColor} ${styleToUse.txtColor} ${styleToUse.border} rounded-lg p-4 w-[200px] h-fit mt-10 animate-wobble`}
            >
                <h2 className="text-center">{TurnToPlayValue.turnToPlay}</h2>
            </div>
            <div className="bg-neutral-900 m-5 mt-20 p-5 rounded-lg self-stretch">
                <h2>Rules (hover on each rule for more info)</h2>
                <ul className="list-disc mt-5 [&>*]:ml-10">
                    <li
                        data-tooltip-id="tooltip"
                        data-tooltip-html="google en-passant"
                    >
                        Forced en-passant
                    </li>
                    <li
                        data-tooltip-id="tooltip"
                        data-tooltip-html="NOTE: DONT move your pawn to promoting square if you want knight boost<br />
                        <br />
                        If your pawn is one move away from promotion, then instead of promoting your pawn<br/>you can directly go where the knight is supposed to be.
                        <br /><br />
                        Example: black pawn is on a2, then instead of moving pawnt to a1,<br />you can move it to c2 or b3. Moving it to a1 WILL NOT GIVE A KNIGHT OPTION"
                    >
                        Knight booooosstt
                    </li>
                    <li
                        data-tooltip-id="tooltip"
                        data-tooltip-html="Two bishops 1+1 pawns"
                    >
                        Il-vaticano
                    </li>
                    <li
                        data-tooltip-id="tooltip"
                        data-tooltip-html="No king can move to c2"
                    >
                        Illegal c2
                    </li>
                </ul>
                <Tooltip id="tooltip" />
            </div>
        </div>
    );
};
