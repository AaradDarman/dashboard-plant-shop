import React, { useEffect, useState } from "react";

import axios from "axios";
import isEmpty from "lodash/isEmpty";
import { useDispatch, useSelector } from "react-redux";

import statesData from "public/assets/province.json";
import cityData from "public/assets/city.json";
import SelectAddressModal from "components/modals/SelectAddressModal";
import AddAddressModal from "components/modals/AddAddressModal";
import DeleteAddressModal from "components/modals/DeleteAddressModal";
import { addNewAddress, deleteAddress, editAddress } from "redux/slices/user";
import LoadingComponent from "components/shared/LoadingComponent";
import { useDebounce } from "components/hooks/useDebounce";
import { mapContext } from "./map-context";

const MapContext = ({ children }) => {
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isSelectAddressModalOpen, setIsSelectAddressModalOpen] =
    useState(false);
  const [isDeleteAddressModalOpen, setIsDeleteAddressModalOpen] =
    useState(false);
  const [targetAddressForDelete, setTargetAddressForDelete] = useState("");
  const [targetAddressForEdit, setTargetAddressForEdit] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([28.946301, 53.647447]);
  const [map, setMap] = useState(null);
  const [postalAddress, setPostalAddress] = useState("");
  const [city, setCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [postalCode, setPostalCode] = useState("");
  const [plaque, setPlaque] = useState("");
  const [addressFetching, setAddressFetching] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);

  const [receiverFName, setReceiverFName] = useState("");
  const [receiverLName, setReceiverLName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  const openAddAddressModal = () => {
    setIsAddAddressModalOpen(true);
  };
  const closeAddAddressModal = () => {
    setIsAddAddressModalOpen(false);
  };

  const openSelectAddressModal = () => {
    setIsSelectAddressModalOpen(true);
  };
  const closeSelectAddressModal = () => {
    setIsSelectAddressModalOpen(false);
  };

  const openDeleteAddressModal = (addressId) => {
    setTargetAddressForDelete(addressId);
    setIsDeleteAddressModalOpen(true);
  };
  const closeDeleteAddressModal = () => {
    setIsDeleteAddressModalOpen(false);
  };

  const openEditAddressModal = (address) => {
    setTargetAddressForEdit(address);
    setMapCenter(address.geoLocation);
    setPostalAddress(address.postalAddress);
    setPostalCode(address.postalCode);
    setPlaque(address.plaque);
    setReceiverFName(address.receiver.fName);
    setReceiverLName(address.receiver.lName);
    setReceiverPhone(address.receiver.phoneNumber);
    setIsAddAddressModalOpen(true);
  };

  const mapStatesCleanUp = () => {
    setTargetAddressForEdit("");
    setMapCenter([28.946301, 53.647447]);
    setPostalAddress("");
    setSearchTerm("");
    setAddressState("");
    setCity("");
    setPostalCode("");
    setPlaque("");
    setReceiverFName("");
    setReceiverLName("");
    setReceiverPhone("");
  };

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangeView = (item) => {
    setMapCenter([item.location.y, item.location.x]);
    map.flyTo([item.location.y, item.location.x], 15);
    setSearchResults([]);
    setSearchTerm("");
  };

  let debouncedSeasrchTerm = useDebounce(searchTerm, 500);

  const fetchSearch = async () => {
    try {
      const { status, data } = await axios.get(
        `https://api.neshan.org/v1/search?term=${searchTerm}&lat=28.946301&lng=53.647447`,
        { headers: { "Api-Key": "service.20b60d22d9f74424a6f43ac927e1d20c" } }
      );
      setSearchResults(data.items);
    } catch (error) {
      console.log(error);
    }
  };

  const findAddress = async () => {
    try {
      // const { status: statesStatus, data: statesData } = await axios.get(
      //   `https://iran-locations-api.vercel.app/api/v1/states`
      // );
      const fetchStates = statesData.map(({ name: label, ...others }) => ({
        label: `استان ${label}`,
        ...others,
      }));
      setStates(fetchStates);
      setAddressFetching(true);
      const { status, data } = await axios.get(
        `https://api.neshan.org/v4/reverse?lat=${mapCenter[0]}&lng=${mapCenter[1]}`,
        { headers: { "Api-Key": "service.f3c46cc4da694847a5823082da38fed6" } }
      );
      if (status === 200) {
        let splitStateString = data.state.replace("استان ", "");
        let selectedProvinceId = statesData.find(
          (province) => province.name === splitStateString
        )?.id;
        setPostalAddress(data.formatted_address);
        setAddressState({ label: data.state, id: selectedProvinceId });
        setCity({ label: data.city });
        setAddressFetching(false);
      }
    } catch (error) {
      setAddressFetching(false);
      console.log(error);
    }
  };

  const getCities = async () => {
    try {
      // const { status, data } = await axios.get(
      //   `https://iran-locations-api.vercel.app/api/v1/cities?state=${splitStateString}`
      // );
      const fetchCities = cityData
        .filter((city) => city.province === addressState.id)
        .map(({ name: label, ...others }) => ({
          label,
          ...others,
        }));
      setCities(fetchCities);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewAddress = async (values) => {
    try {
      if (isEmpty(targetAddressForEdit)) {
        await dispatch(
          addNewAddress({
            userId: user.user._id,
            city: values.city.label,
            province: values.addressState.label,
            postalAddress: values.postalAddress,
            postalCode: values.postalCode,
            plaque: values.plaque,
            geoLocation: mapCenter,
            receiver: {
              fName: values.receiverFName,
              lName: values.receiverLName,
              phoneNumber: values.receiverPhone,
            },
          })
        )
          .unwrap()
          .then((originalPromiseResult) => {
            mapStatesCleanUp();
            closeAddAddressModal();
          });
      } else {
        await dispatch(
          editAddress({
            addressId: targetAddressForEdit?._id,
            userId: user.user._id,
            city: values.city.label,
            province: values.addressState.label,
            postalAddress: values.postalAddress,
            postalCode: values.postalCode,
            plaque: values.plaque,
            geoLocation: mapCenter,
            receiver: {
              fName: values.receiverFName,
              lName: values.receiverLName,
              phoneNumber: values.receiverPhone,
            },
          })
        )
          .unwrap()
          .then((originalPromiseResult) => {
            mapStatesCleanUp();
            closeAddAddressModal();
          });
      }
    } catch (rejectedValueOrSerializedError) {
      mapStatesCleanUp();
      closeAddAddressModal();
    }
  };

  const handleDeleteAddress = async () => {
    try {
      await dispatch(deleteAddress(targetAddressForDelete))
        .unwrap()
        .then((originalPromiseResult) => {
          console.log(originalPromiseResult.user);
          closeDeleteAddressModal();
        });
    } catch (rejectedValueOrSerializedError) {
      closeDeleteAddressModal();
    }
  };

  useEffect(() => {
    if (addressState != "") getCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressState]);

  useEffect(() => {
    fetchSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSeasrchTerm]);

  return (
    <mapContext.Provider
      value={{
        openAddAddressModal,
        closeAddAddressModal,
        openSelectAddressModal,
        closeSelectAddressModal,
        openDeleteAddressModal,
        closeDeleteAddressModal,
        openEditAddressModal,
        handleAddNewAddress,
        handleDeleteAddress,
        mapStatesCleanUp,
        searchTerm,
        setSearchTerm,
        handleChangeSearch,
        searchResults,
        setSearchResults,
        mapCenter,
        setMapCenter,
        handleChangeView,
        map,
        setMap,
        findAddress,
        postalAddress,
        setPostalAddress,
        city,
        setCity,
        addressState,
        setAddressState,
        states,
        cities,
        receiverFName,
        setReceiverFName,
        receiverLName,
        setReceiverLName,
        receiverPhone,
        setReceiverPhone,
        postalCode,
        setPostalCode,
        plaque,
        setPlaque,
        addressFetching,
      }}
    >
      {children}
      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={closeAddAddressModal}
        modalState="map"
      />
      <SelectAddressModal
        isOpen={isSelectAddressModalOpen}
        onClose={closeSelectAddressModal}
      />
      <DeleteAddressModal
        isOpen={isDeleteAddressModalOpen}
        onClose={closeDeleteAddressModal}
        onDeleteClick={handleDeleteAddress}
      />
      <LoadingComponent show={user?.status === "loading"} />
    </mapContext.Provider>
  );
};

export default MapContext;
