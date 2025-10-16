import CardRoot from "@/components/cards/CardRoot";

export default async function SecondTmp(){
    return (
        <>
            <CardRoot 
                card={
                    {main_image: "aaa",
                    logo_image: "bbb"}
                } 
                isExtended={false}
                isCreate={false}
            >
                <p>tmp</p>
            </CardRoot>
            
        </>
    )
}