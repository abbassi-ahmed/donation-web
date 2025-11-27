import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap"
import axios from "axios"
import { toast } from "react-toastify"

const EditSubscriptionModal = ({
  show,
  toggle,
  subscription,
  onCloseClick,
  onSaveFinished,
  clubs,
  sports,
}) => {
  const [tempSubscription, setTempSubscription] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  })
  const [subscriptionType, setSubscriptionType] = useState("sport")
  const [selectedSportId, setSelectedSportId] = useState("")
  const [selectedClubId, setSelectedClubId] = useState("")

  useEffect(() => {
    if (show) {
      setTempSubscription(subscription)
      setSubscriptionType(subscription?.sport?.id ? "sport" : "club")
      setSelectedSportId(subscription?.sport?.id || "")
      setSelectedClubId(subscription?.club?.id || "")
    }
  }, [show, subscription])

  const onSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_DATABASEURL}/subscription/update/${subscription.id}`,
        {
          title: tempSubscription.title,
          description: tempSubscription.description,
          price: Number(tempSubscription.price),
          duration: Number(tempSubscription.duration),
          [subscriptionType === "sport" ? "sportId" : "clubId"]:
            subscriptionType === "sport" ? selectedSportId : selectedClubId,
        },
        {
          headers: {
            token: localStorage.getItem("authUser")?.replace(/"/g, ""),
          },
        }
      )
      onSaveFinished()
      toast.success("Subscription updated successfully")
    } catch (error) {
      console.error("Error updating subscription", error)
      toast.error("Failed to update subscription. Please try again.")
    }
  }
  const handleSave = async e => {
    e.preventDefault()
    await onSave()
    await onCloseClick()
  }

  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true} size="xl">
      <ModalHeader toggle={toggle}>Edit Subscription</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSave}>
          <FormGroup className="d-flex gap-3">
            <Label for="type">Type</Label>
            <Input
              type="radio"
              name="type"
              value="sport"
              checked={subscriptionType === "sport"}
              onChange={() => setSubscriptionType("sport")}
            />
            Sport
            <Input
              type="radio"
              name="type"
              value="club"
              checked={subscriptionType === "club"}
              onChange={() => setSubscriptionType("club")}
            />
            Club
          </FormGroup>

          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={tempSubscription.title}
              onChange={e =>
                setTempSubscription({
                  ...tempSubscription,
                  title: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              id="description"
              name="description"
              value={tempSubscription.description}
              onChange={e =>
                setTempSubscription({
                  ...tempSubscription,
                  description: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="price">Price</Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={tempSubscription.price}
              onChange={e =>
                setTempSubscription({
                  ...tempSubscription,
                  price: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="duration">Duration (Months)</Label>
            <Input
              type="number"
              id="duration"
              name="duration"
              value={tempSubscription.duration}
              onChange={e =>
                setTempSubscription({
                  ...tempSubscription,
                  duration: e.target.value,
                })
              }
            />
          </FormGroup>
          {subscriptionType === "sport" && (
            <FormGroup>
              <Label for="sport">Sport</Label>
              <Input
                type="select"
                id="sport"
                name="sport"
                value={selectedSportId}
                onChange={e => setSelectedSportId(e.target.value)}
              >
                <option value="">Select Sport</option>
                {sports.map(sport => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
          )}
          {subscriptionType === "club" && (
            <FormGroup>
              <Label for="club">Club</Label>
              <Input
                type="select"
                id="club"
                name="club"
                value={selectedClubId}
                onChange={e => setSelectedClubId(e.target.value)}
              >
                <option value="">Select Club</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
          )}

          <Button type="submit" color="primary">
            Save Changes
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default EditSubscriptionModal
