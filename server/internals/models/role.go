package models

type Role int

const (
	Admin Role = iota + 100
	Member
)

func (r Role) Values() []Role {
	return []Role{Admin, Member}
}

func (r Role) String() string {
	roles := [...]string{"ADMIN", "MEMBER"}
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
	case Admin, Member:
		return true
	}
	return false
}
