import glp from "@/assets/images/glp/glp_logo@3.png";
import company from "@/assets/images/glp/glp_company@3.png";
import credit from "@/assets/images/glp/glp_credit@3.png";
import person from "@/assets/images/glp/glp_person@3.png";
import position from "@/assets/images/position@2x.png";
import discredit from "@/assets/images/discredit.png";
import enterprise from "@/assets/images/glp/glp_enterprise@3.png";


// const graphNodeIcon = [icon0, icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, icon10, icon11, icon12, icon13, icon14, icon15, icon16, icon17, icon18, icon19];

const graphNode = {
    GLP: {
        fillColor: "#078e34",
        radius: 28,
        image: glp
    },
    PARENT: {
        fillColor: "#448aca",
        radius: 22,
        image: company
    },
    SUB: {
        fillColor: "#f97657",
        radius: 16,
        image: credit
    },
    INDEPENDENCE: {
        fillColor: "#f97657",
        radius: 16,
        image: credit
    },
    COMPANY: {
        fillColor: "#f8b551",
        radius: 10,
        image:enterprise
    },
    PERSON: {
        fillColor: "#f8b551",
        radius: 10,
        image:person
    },
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
    Interpersonal: {
        fillColor: "#B8BF80"
    },
    Guarantee: {
        fillColor: "#ACD598"
    },
    Claim: {
        fillColor: "#7ECEF4"
    },
    GPS: {
        fillColor: "#b5c4ce"
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
    Interpersonal: {
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
    GPS: {
        label: "GPS供应商",
        fillColor: "#b5c4ce"
    },
    default: {
        fillColor: "#EEE"
    }
}


const graphRiskNode = {
    Start: {
        fillColor: "rgb(249, 75, 75)",
        radius: 10,
    },
    End: {
        fillColor: "rgb(251, 165, 93)",
        radius: 10,
    },
    Ordinary: {
        fillColor: "rgb(149, 177, 253)",
        radius: 10
    }
}

const themeColor = '#FE7011';

// const apiPath = '/kg-api';
const apiPath = '/kg-api-web';

export { apiPath, graphNode, graphLink, themeColor, graphNodeIcon,  position, discredit, graphLinkText,graphRiskNode}