import { Container, Grid, styled } from "@mui/material";
import AppBar from "../../components/AppBar/AppBar";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import FloatingMenu from "./FloatingMenu/FloatingMenu";
import { useSelector } from "react-redux";
import { selectUserLanguage } from "../../redux/selectors/userSelectors";
import i18next from "i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import Notification from "../../redux/components/Notification/Notification";
import { useGetPropertyListQuery, useLazySearchPropertyQuery } from "../../hooks/api/property.api";
import { debounce, map } from "lodash-es";

const PropertyListing = () => {
    const [page, setPage] = useState(1);
    const [searchResult, setSearchResult] = useState(false)

    const userLang = useSelector(selectUserLanguage);
    const observerTarget = useRef(null);
    const itemsCount = 20

    console.log("page", page);

    const { data = [], isLoading, isError, isFetching } = useGetPropertyListQuery({ page, limit: itemsCount });
    console.log({ isLoading, isFetching, observerTarget })


      const [searchValue, setSearchValue] = useState('');
        const [searchProperty, {  isSuccess, data : searchProperties }] = useLazySearchPropertyQuery();
    
        const memonizedSearchPropery = useCallback(debounce((val) => searchProperty(val), 3000), [])
    
        const onChange = (event: any) => {
            setSearchValue(event?.target?.value);
            memonizedSearchPropery(event?.target?.value)
        }


        useEffect(()=>{

            if(searchProperties && searchProperties?.length > 0){
                setSearchResult(true)
            }

           

            console.log("djdjdjd",  searchProperties);
            

        }, [searchProperties])

        useEffect(()=>{

            if(!searchValue){

                setSearchResult(false)
            }

        }, [searchValue])


    useEffect(() => {

        if(searchValue){
            return 
        }


        const observer = new IntersectionObserver(
            (entries) => {
                console.log({ isLoading, isFetching });
                if (!isLoading && !isFetching) {
                    if (entries[0].isIntersecting) {
                        setPage((prev) => prev + 1);
                    }
                }
            }, {
            threshold: 0.10
        }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        }

    }, [observerTarget, isLoading, isFetching, searchValue])

    // console.log({ data });

    useEffect(() => {
        // console.log("updated user lang");
        i18next.changeLanguage(userLang);
    }, [userLang])

    const renderLoader = () =>
        map(new Array(itemsCount), (item, index) => (
            <Grid key={index} item xs={6} md={3} lg={2}>
                <PropertyCard isLoading={true} />
            </Grid>
        ));

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column' }} disableGutters maxWidth={false}>
            <AppBar searchValue={searchValue} onChange={onChange} ></AppBar>
            <CategoryBar></CategoryBar>
            <Grid container spacing={3} padding={2}>
                {
                    searchProperties && searchProperties.length > 0 && searchValue ?  map( searchProperties , (property) => (
                        <StyledGridItem item xs={6} md={3} lg={2} key={property?._id}>
                            <PropertyCard
                                key={property?._id}
                                imgSrc={property?.images?.picture_url}
                                name={property?.name}
                                price={property?.price}
                                rating={property?.review_score?.review_scores_rating} />
    
                        </StyledGridItem>
                    )) : map( data , (property) => (
                        <StyledGridItem item xs={6} md={3} lg={2} key={property?._id}>
                            <PropertyCard
                                key={property?._id}
                                imgSrc={property?.images?.picture_url}
                                name={property?.name}
                                price={property?.price}
                                rating={property?.review_score?.review_scores_rating} />
    
                        </StyledGridItem>
                    ))
                }
                

                <>{ isLoading || isFetching && renderLoader()}</>
            </Grid>
            <div ref={observerTarget} style={{ paddingBottom: "50px" }} />
            <FloatingMenu />
            <Notification />
        </Container>
    )
}

const StyledGridItem = styled(Grid)`
  && {
    flex-basis: 50%; // Two items per row on medium screens
    @media (max-width: 960px) {
      flex-basis: 100%; // One item per row on small screens
    }
  }
`;

export default PropertyListing;