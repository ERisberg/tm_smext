import axios from "axios";
import fetchAdapter from "./adapter";

axios.defaults.adapter = fetchAdapter;

const myCss = GM_getResourceText("JQUERY_UI");
console.log(myCss);
GM_addStyle(myCss);

$("head").append(
  `<link rel="stylesheet" href="https://erisberg.github.io/tm_smext/public/style.css" type="text/css" />`
);

const ITEM_NAME_ID = "largeiteminfo_item_name";
const BUYORDER_INPUT_ID = "market_buyorder_dialog_paymentinfo";

const ID_PREFIX = "sms";

type ItemDetails = {
  itemName: string;
};

export type MenuState = {
  isOpen: boolean;
};

const itemDetails: ItemDetails = { itemName: "" };
const customerDetails = {};

const getID = (id: string) => `${ID_PREFIX}_${id}`;

document.addEventListener("menuToggle", (e: CustomEvent<MenuState>) => {
  const icon = $("#" + getID("btnToggleIcon"));

  $(icon).css({
    transform: `rotate(${e.detail.isOpen ? "90" : "0"}deg)`,
  });
});

function main() {
  getItemDetails();
  getCustomerDetails();
  createMenu();
}

function getItemDetails() {
  itemDetails.itemName = $(`#${ITEM_NAME_ID}`).text();
}

function getCustomerDetails() {
  $(`#${BUYORDER_INPUT_ID}`)
    .find("input")
    .map(function () {
      const name = $(this).attr("name");
      if (name !== undefined) (customerDetails as any)[name] = this.value;
    });

  // customerDetails.wallet_currency = window.g_rgWalletInfo.wallet_currency;
}

function createMenu() {
  $("body").append(`
        <div id="${getID("wrapper")}">
            <button id="${getID("btnToggle")}"><span id="${getID(
    "btnToggleIcon"
  )}">&#10095;</span> Menu</button>
            <div id="${getID("menu")}">
                <p>Hello world</p>
            </div>
        </div>
    `);

  $("#" + getID("wrapper")).css({
    position: "absolute",
    top: 0,
    left: 0,
    padding: ".5rem",
  });

  //   $("#" + getID("btnToggle")).css({
  //     "border-radius": "2px",
  //     outline: "none",
  //     border: "none",
  //     padding: "6px 10px",
  //     background: "linear-gradient( to bottom, #a4d007 5%, #536904 95%)",
  //     color: "#D2E885",
  //     cursor: "pointer",
  //   });

  $("#" + getID("btnToggle")).addClass("sms_btn");

  $("#" + getID("btnToggle")).on({
    mouseenter: function () {
      $(this).css({
        background: "linear-gradient( to bottom, #b6d908 5%, #80a006 95%)",
      });
    },
    mouseleave: function () {
      $(this).css({
        background: "linear-gradient( to bottom, #a4d007 5%, #536904 95%)",
      });
    },
  });

  const menu = $("#" + getID("menu"));
  $("#" + getID("btnToggleIcon")).css({
    display: "inline-block",
    transition: "transform .2s ease",
    "font-weight": "bold",
    transform: `rotate(${menu.css("display") !== "none" ? "90" : "0"}deg)`,
  });

  $("#" + getID("btnToggle")).on("click", () => {
    const menu = $("#" + getID("menu"));
    menu.toggle();

    const menuOpen = menu.css("display") !== "none";

    const event = new CustomEvent("menuToggle", {
      detail: {
        open: menuOpen,
      },
    });

    dispatchEvent(event);
  });
}

main();
