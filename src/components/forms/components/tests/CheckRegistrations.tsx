"use client"

import { CardsRootContext, useCardsRoot } from "../../root/RootContext";

export default function CheckRegistrations() {
  const { registeredItemsFunctions } = useCardsRoot();
  


  return (
    <div>
      <p>now available { registeredItemsFunctions?.length ?? 0} functions</p>
    </div>
  );
}