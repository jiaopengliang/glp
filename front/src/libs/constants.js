import longtou from "@/assets/images/longtou@3x.png";
import longgujia from "@/assets/images/longgujia@3x.png";
import kongzhiren from "@/assets/images/kongzhiren@3x.png";
import noData from "@/assets/images/icon_empty_wuguanzhu@2x.png";
import noPath from "@/assets/images/icon_empty_wulianxi@2x.png";
import position from "@/assets/images/position@2x.png";
import discredit from "@/assets/images/discredit.png";


// const graphNodeIcon = [icon0, icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, icon10, icon11, icon12, icon13, icon14, icon15, icon16, icon17, icon18, icon19];

const graphNode = {
    Top: {
        fillColor: "#bc2f2f",
        radius: 36,
        // image: longtou
    },
    Skeleton: {
        fillColor: "#ffb648",
        radius: 20,
        // image: longgujia
    },
    uboTop: {
        fillColor: "#0076ff",
        radius: 16,
        image: kongzhiren
    },
    Ordinary: {
        fillColor: "#9DC3FF",
        radius: 10
    },
    // Nature: {
    //     fillColor: "#FFF",
    //     radius: 16,
    //     image: ziranren
    // },
    default: {
        fillColor: "#9DC3FF",
        radius: 10
    }
}

const graphLink = {
    Investment: {
        fillColor: "#F97657"
    },
    Header: {
        fillColor: "#F19EC2"
    },
    Senior: {
        fillColor: "#AA89BD"
    },
    Credit: {
        fillColor: "#EBBC6C"
    },
    Hide: {
        fillColor: "#B8BF80"
    },
    Guarantee: {
        fillColor: "#ACD598"
    },
    Claim: {
        fillColor: "#7ECEF4"
    },
    default: {
        fillColor: "#EEE"
    }
}
const graphLinkText = {
    Investment: {
        label: "投资",
        fillColor: "#F97657"
    },
    Header: {
        label: "工商任职",
        fillColor: "#F19EC2"
    },
    Senior: {
        label: "尽调",
        fillColor: "#AA89BD"
    },
    Credit: {
        label: "授信用信",
        fillColor: "#EBBC6C"
    },
    Hide: {
        label: "普洛斯人际",
        fillColor: "#B8BF80"
    },
    Guarantee: {
        label: "担保",
        fillColor: "#ACD598"
    },
    Claim: {
        label: "债权",
        fillColor: "#7ECEF4"
    },
    default: {
        fillColor: "#EEE"
    }
}

const themeColor = '#FE7011';

// const apiPath = '/kg-api';
const apiPath = '/kg-api-web';

export { apiPath, graphNode, graphLink, themeColor, graphNodeIcon, noData, noPath, position, discredit, graphLinkText}