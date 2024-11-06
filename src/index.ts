import axios from "axios";
import fetchAdapter from "./adapter";

axios.defaults.adapter = fetchAdapter;

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
        <div class="sms_wrapper" id="${getID("wrapper")}">
            <button class="sms_btn" id="${getID("btnToggle")}">
                <span class="sms_btnToggleIcon" id="${getID(
                  "btnToggleIcon"
                )}">&#10095;</span> Menu
            </button>
            <div id="${getID("menu")}">
                <p>Hello world</p>
            </div>
        </div>
    `);

  const menu = $("#" + getID("menu"));
  const isOpen = menu.css("display") !== "none";

  $("#" + getID("btnToggleIcon")).css({
    transform: `rotate(${isOpen ? "90" : "0"}deg)`,
  });

  $("#" + getID("btnToggle")).on("click", () => {
    menu.toggle();
    const isOpen = menu.css("display") !== "none";
    onMenuToggle(isOpen);
  });
}

function onMenuToggle(isOpen: boolean) {
  const icon = $("#" + getID("btnToggleIcon"));

  const rotation = `rotate(${isOpen ? "90" : "0"}deg)`;

  $(icon).css({
    transform: rotation,
  });
}

main();
