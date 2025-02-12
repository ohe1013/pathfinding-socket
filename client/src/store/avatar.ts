import { create } from "zustand";

interface Avatar {
  useUrl : boolean;
  url : string
  setUrl : 
}


const useAvatar = create<Avatar>(set =>({
  useUrl: false,
  url :''

}))