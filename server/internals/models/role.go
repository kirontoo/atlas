package models

type Role int

const (
	Admin Role = iota + 100
	Owner
	Member
)

func (r Role) String() string {
	roles := [...]string{"ADMIN", "MEMBER", "OWNER"}
	if r < Admin || r > Member {
		return "Unknown"
	}
	return roles[r]
}

func (r Role) IsEqual(other Role) bool {
	return r == other
}

func (r Role) IsARole() bool {
	switch r {
	case Admin, Owner, Member:
		return true
	}
	return false
}
