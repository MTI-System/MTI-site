import CardRoot from "@/components/cards/CardRoot";

export default async function SecondTmp(){
    return (
        <>
            <CardRoot 
                card={
                    {
                        id: 1,
                        main_image: "5391124322845847095_120.jpg",
                        logo_image: "5391124322845847064_120.jpg",
                        title: "Название турнира"
                    }
                } 
                isExtended={false}
                isCreate={false}
                mainPath="tournaments"
            >
                <p>tmp</p>
            </CardRoot>
            
        </>
    )
}