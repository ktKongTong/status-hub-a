import React from "react";
import {redirect} from "next/navigation";

export default function Home() {
  return redirect('/dashboard/credentials')
}